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
import {Langs} from '@/lib/langs'

type Engine = {
    id: number
    name: string
}

export default function Translator() {
    const [engines, setEngines] = useState(Array<Engine>)
    const [inputValue, setInputValue] = useState("");
    const [content, setContent] = useState("");
    const initialized = useRef(false)
    const mode = useRef("2")
    const model = useRef("1")
    const sourceLang = useRef("自动检测")
    const targetLang = useRef("英语")

    useEffect(() => {
        if (!initialized.current) {
            getSupportEngine()
            initialized.current = true
            document.title = "AI翻译"
        }
    }, []);
    const modeChange = (val: string) => {
        mode.current = val
    }

    const modelChange = (val: string) => {
        model.current = val
    }

    const langChange = (val: string) => {
        sourceLang.current = val
    }

    const targetLangChange = (val: string) => {
        targetLang.current = val
    }

    const getSupportEngine = () => {
        GET(APIS.GET_SUPPORT_ENGINES, {}).then(res => {
            console.log(res)
            setEngines(res.data.platform)
        })
    }

    const submit = () => {
        setContent("")
        let temp = ""
        let body = {
            target_lang: targetLang.current,
            engineId: model.current,
            content: inputValue,
        }
        fetchStream(APIS.PUSH_MSG_TRANSLATOR, body, function (value: AllowSharedBufferSource | undefined) {
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
                            <Select defaultValue={sourceLang.current} onValueChange={langChange}>
                                <SelectTrigger className="">
                                    <SelectValue placeholder="语言选择"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem key={0} value={"自动检测"}>自动检测</SelectItem>
                                        {Langs.map((lang,index) => {
                                            return <SelectItem key={index+1} value={lang.language + ""}>{lang.language}</SelectItem>
                                        })}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <div className={"ml-1 mr-1"}>
                                <svg className="icon" viewBox="0 0 1024 1024" version="1.1"
                                     xmlns="http://www.w3.org/2000/svg" p-id="5689" width="20" height="20">
                                    <path
                                        d="M878.933 460.8H183.467c-12.8 0-21.334-8.533-21.334-21.333s8.534-21.334 21.334-21.334h695.466c12.8 0 21.334 8.534 21.334 21.334s-12.8 21.333-21.334 21.333z"
                                        fill="#515151" p-id="5690"></path>
                                    <path
                                        d="M878.933 456.533c-4.266 0-12.8 0-17.066-4.266l-256-256c-8.534-8.534-8.534-21.334 0-29.867 8.533-8.533 21.333-8.533 29.866 0l256 256c8.534 8.533 8.534 21.333 0 29.867-4.266 0-8.533 4.266-12.8 4.266z m0 149.334H183.467c-12.8 0-21.334-8.534-21.334-21.334s8.534-21.333 21.334-21.333h695.466c12.8 0 21.334 8.533 21.334 21.333s-12.8 21.334-21.334 21.334z"
                                        fill="#515151" p-id="5691"></path>
                                    <path
                                        d="M439.467 861.867c-4.267 0-12.8 0-17.067-4.267l-256-256c-8.533-8.533-8.533-21.333 0-29.867 8.533-8.533 21.333-8.533 29.867 0l256 256c8.533 8.534 8.533 21.334 0 29.867-4.267 4.267-8.534 4.267-12.8 4.267z"
                                        fill="#515151" p-id="5692"></path>
                                </svg>
                            </div>
                            <Select defaultValue={targetLang.current} onValueChange={targetLangChange}>
                                <SelectTrigger className="">
                                    <SelectValue placeholder="目标语言"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {Langs.map((lang, index) => {
                                            return <SelectItem key={index}
                                                               value={lang.language + ""}>{lang.language}</SelectItem>
                                        })}
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
                                            {engines.map((engine, index) => {
                                                return <SelectItem key={index}
                                                                   value={engine.id + ""}>{engine.name}</SelectItem>
                                            })}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={submit}>翻译</Button>
                        </div>
                    </div>
                    <div className={"flex flex-row items-center justify-between mt-2"}>
                        <Textarea className={"h-[200px]"} placeholder={"在此输入您想翻译的段落"} value={inputValue}
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