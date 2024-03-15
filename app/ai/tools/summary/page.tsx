'use client'
import {TopBar} from "@/components/topbar/topbar";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectValue,
    SelectGroup,
    SelectItem
} from "@/components/ui/select";
import {ScrollArea} from "@/components/ui/scroll-area";
import "./index.css"
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {GET, POST} from "@/utils/http";
import {APIS} from "@/api/api";
import {fetchStream} from "@/utils/stream";
import {Viewer} from '@bytemd/react'
import 'bytemd/dist/index.css'
import {UploadIcon} from '@radix-ui/react-icons'
import {Input} from "@/components/ui/input";
import {useToast} from "@/components/ui/use-toast";
import {Badge} from "@/components/ui/badge";

type Engine = {
    id: number
    name: string
}

export default function Translator() {
    const [engines, setEngines] = useState(Array<Engine>)
    const [inputValue, setInputValue] = useState("");
    const [content, setContent] = useState("");
    const [filename, setFileName] = useState("");
    const [filepath, setFilePath] = useState("");
    const {toast} = useToast()
    const initialized = useRef(false)
    const mode = useRef("2")
    const model = useRef("1")
    const fileSelectRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!initialized.current) {
            getSupportEngine()
            initialized.current = true
            document.title = "文章总结"
        }
    }, []);

    const modelChange = (val: string) => {
        model.current = val
    }

    const getSupportEngine = () => {
        GET(APIS.GET_SUPPORT_ENGINES, {}).then(res => {
            console.log(res)
            setEngines(res.data.platform)
        })
    }

    const uploadFile = () => {
        fileSelectRef.current?.click()
        console.log("select file")
    }

    const fileChange = (e: ChangeEvent) => {
        // @ts-ignore
        const file = e.target.files[0]
        let formData = new FormData;
        formData.append("files", file)
        POST(APIS.UPLOAD_FILE, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(res => {
            if (res.code != 200) {
                toast({
                    title: "上传文件失败",
                    description: "暂不支持此文件类型",
                })
                return
            }
            toast({
                title: "上传文件成功",
            })
            setFilePath(res.data.path)
            setFileName(res.data.name)
        })
    }

    const submit = () => {
        setContent("")
        let temp = ""
        let body = {
            engineId: model.current,
            content: inputValue,
            filepath: filepath,
        }
        fetchStream(APIS.PUSH_MSG_SUMMARY, body, function (value: AllowSharedBufferSource | undefined) {
            const val = new TextDecoder().decode(value);
            try {
                let parse = JSON.parse(val);
                if (parse.code == 500) {
                    temp = parse.msg
                }
            } catch (e) {
                temp = temp + val
            } finally {
                setContent(temp)
            }
        }, () => {
            console.log("done")
        }).then(res => {
        })
    }

    return <div className={"root"}>
        <TopBar/>
        <div className={"flex flex-col chat items-center p-1"}>
            <ScrollArea>
                <div className={"w-80vw m-t-24 ml-1 mr-1"}>
                    <div className={"flex flex-row items-center justify-between"}>
                        <div className={"flex flex-row items-center"}>
                            <Input type={"file"} className={"hidden"} ref={fileSelectRef} onChange={fileChange}></Input>
                            <Button variant={"outline"} onClick={uploadFile}><UploadIcon/></Button>
                            <Badge variant="secondary" className={(filename === "" ? "hidden" : "")+" ml-1"}>{filename}</Badge>
                        </div>
                        <div className={"flex flex-row items-center"}>
                            <Label htmlFor="terms" className={"mr-2 minor-content"}>AI引擎：</Label>
                            <div className={"mr-2"}>
                                <Select defaultValue={"1"} onValueChange={modelChange}>
                                    <SelectTrigger className="">
                                        <SelectValue placeholder="AI模型"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {engines.map((engine, index) => {
                                                return <SelectItem key={index}
                                                                   value={engine.id + ""}>{engine.name}</SelectItem>
                                            })}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={submit}>总结</Button>
                        </div>
                    </div>
                    <div className={"flex flex-row items-center justify-between mt-2"}>
                        <Textarea className={"h-[200px]"} placeholder={"在此输入您想总结的段落"} value={inputValue}
                                  onChange={e => {
                                      setInputValue(e.target.value);
                                  }}/>
                    </div>
                    <div className={"m-t-24 min-title"}>
                        翻译结果:
                    </div>
                    <div className={"mt-2"}>
                        <Viewer value={content}/>
                    </div>

                </div>
            </ScrollArea>
        </div>
    </div>
}