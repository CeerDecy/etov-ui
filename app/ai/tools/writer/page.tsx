'use client'
import {TopBar} from "@/components/topbar/topbar";
import {Textarea} from "@/components/ui/textarea";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectValue,
    SelectGroup,
    SelectItem, SelectLabel
} from "@/components/ui/select";
import {ScrollArea} from "@/components/ui/scroll-area";
import "./index.css"
import {useEffect, useRef, useState} from "react";
import {GET} from "@/utils/http";
import {APIS} from "@/api/api";
import {fetchStream} from "@/utils/stream";
import {Viewer} from '@bytemd/react'
import 'bytemd/dist/index.css'
import {Langs} from '@/lib/langs'

type Engine = {
    id: number
    name: string
}

export default function Writer() {
    const [engines, setEngines] = useState(Array<Engine>)
    const [customs, setCustoms] = useState(Array<Engine>)
    const [inputValue, setInputValue] = useState("");
    const [content, setContent] = useState("");
    const initialized = useRef(false)
    const mode = useRef("2")
    const model = useRef("1")
    const types = useRef("自我介绍")

    useEffect(() => {
        if (!initialized.current) {
            getSupportEngine()
            initialized.current = true
            document.title = "AI写作助手"
        }
    }, []);
    const modeChange = (val: string) => {
        mode.current = val
    }

    const modelChange = (val: string) => {
        model.current = val
    }

    const langChange = (val: string) => {
        types.current = val
    }

    const getSupportEngine = () => {
        GET(APIS.GET_SUPPORT_ENGINES, {}).then(res => {
            setEngines(res.data.platform)
            setCustoms(res.data.custom)
        })
    }

    const submit = () => {
        setContent("")
        let temp = ""
        let body = {
            types: types.current,
            engineId: model.current,
            content: inputValue,
        }
        fetchStream(APIS.PUSH_MSG_WRITE, body, function (value: AllowSharedBufferSource | undefined) {
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
                            <Select defaultValue={types.current} onValueChange={langChange}>
                                <SelectTrigger className="">
                                    <SelectValue placeholder="语言选择"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value={"自我介绍"}>自我介绍</SelectItem>
                                        <SelectItem value={"简历"}>简历</SelectItem>
                                        <SelectItem value={"论文摘要"}>论文摘要</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
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
                                            <SelectLabel>官方</SelectLabel>
                                            {engines.map((engine, index) => {
                                                return <SelectItem key={index}
                                                                   value={engine.id + ""}>{engine.name}</SelectItem>
                                            })}
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>自定义</SelectLabel>
                                            {customs.map((engine, index) => {
                                                return <SelectItem key={index}
                                                                   value={engine.id + ""}>{engine.name}</SelectItem>
                                            })}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={submit}>写作</Button>
                        </div>
                    </div>
                    <div className={"flex flex-row items-center justify-between mt-2"}>
                        <Textarea className={"h-[200px]"} placeholder={"在此输入您想提供的一些参数"} value={inputValue}
                                  onChange={e => {
                                      setInputValue(e.target.value);
                                  }}/>
                    </div>
                    <div className={"m-t-24 min-title"}>
                        写作结果:
                    </div>
                    <div className={"mt-2"}>
                        <Viewer value={content}/>
                    </div>

                </div>
            </ScrollArea>
        </div>
    </div>
}