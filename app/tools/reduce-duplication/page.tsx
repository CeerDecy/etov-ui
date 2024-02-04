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
    SelectItem
} from "@/components/ui/select";
import {ScrollArea} from "@/components/ui/scroll-area";
import "./index.css"
import {useEffect, useRef, useState} from "react";
import {GET} from "@/utils/http";
import {APIS} from "@/api/api";
import {fetchStream} from "@/utils/stream";
import {Viewer} from '@bytemd/react'
import 'bytemd/dist/index.css'

type Engine = {
    id: number
    name: string
}

export default function ReduceDuplication() {
    const [engines, setEngines] = useState(Array<Engine>)
    const [inputValue, setInputValue] = useState("");
    const [content, setContent] = useState("");
    const initialized = useRef(false)
    const mode = useRef("2")
    const model = useRef("1")

    useEffect(() => {
        if (!initialized.current) {
            getSupportEngine()
            initialized.current = true
        }
    }, []);
    const modeChange = (val: string) => {
        mode.current = val
    }

    const modelChange = (val: string) => {
        model.current = val
    }

    const getSupportEngine = () => {
        GET(APIS.GET_SUPPORT_ENGINES, {}).then(res => {
            console.log(res)
            setEngines(res.data.platform)
        })
    }

    const submit = () => {
        console.log(mode.current, model.current, inputValue)
        let temp = ""
        let body = {
            mode: mode.current,
            engineId: model.current,
            content: inputValue,
        }
        fetchStream(APIS.PUSH_MSG_REDUCE_DUPLICATION, body, function (value: AllowSharedBufferSource | undefined) {
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
                        <div className={""}>
                            <Tabs defaultValue="2" onValueChange={modeChange}>
                                <TabsList className="">
                                    <TabsTrigger value="1">精简</TabsTrigger>
                                    <TabsTrigger value="2">润色</TabsTrigger>
                                    <TabsTrigger value="3">丰富</TabsTrigger>
                                </TabsList>
                            </Tabs>

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
                            <Button onClick={submit}>降重</Button>
                        </div>
                    </div>
                    <div className={"flex flex-row items-center justify-between mt-2"}>
                        <Textarea className={"h-[200px]"} placeholder={"在此输入您想降重的段落"} value={inputValue}
                                  onChange={e => {
                                      setInputValue(e.target.value);
                                  }}/>
                    </div>
                    <div className={"m-t-24 min-title"}>
                        降重结果:
                    </div>
                    <div className={"mt-2"}>
                        <Viewer value={content}/>
                    </div>

                </div>
            </ScrollArea>
        </div>
    </div>
}