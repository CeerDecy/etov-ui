'use client'

import {TopBar} from "@/components/topbar/topbar";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useEffect, useRef, useState} from "react";
import {fetchStream} from "@/utils/stream";
import {GET, POST} from "@/utils/http";
import {APIS} from "@/api/api";
import {useToast} from "@/components/ui/use-toast";
import {useRouter, useSearchParams} from "next/navigation";
import {Viewer} from '@bytemd/react'
import 'bytemd/dist/index.css'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

const GPT = "GPT"
const You = "You"
type Message = {
    img: string
    auth: string
    content: string
}

type Engine = {
    id: number
    name: string
}


export default function Chat() {
    const [contents, setContents] = useState(Array<Message>());
    const [engines, setEngines] = useState(Array<Engine>)
    const [customs, setCustoms] = useState(Array<Engine>)
    const [inputValue, setInputValue] = useState("");
    const chatCardRef = useRef(null);
    const scrollRef = useRef(null);
    const initialized = useRef(false)
    const currChat = useRef("")
    const router = useRouter()
    const search = useSearchParams()
    const model = useRef(search.get("model") as string)
    const {toast} = useToast()

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            document.title = "ChatGPT"
            getSupportEngine()
        }
    }, []);

    const getSupportEngine = () => {
        GET(APIS.GET_SUPPORT_ENGINES, {}).then(res => {
            if (res.code === 200) {
                setEngines(res.data.platform)
                setCustoms(res.data.custom)
                getChats()
            } else {
                toast({
                    title: "请求失败",
                    description: res.msg,
                })
            }

        })
    }

    function scrollToBottom() {
        // @ts-ignore
        // chatCardRef.current.scrollTop = chatCardRef.current.scrollHeight;
        // @ts-ignore
        const last = chatCardRef.current.childNodes.length - 1
        // @ts-ignore
        chatCardRef.current.childNodes[last].scrollIntoView({block: "end"})
    }

    async function click() {
        let cache = ""
        let history = [...contents]
        history.push({img: "https://github.com/CeerDecy.png", auth: You, content: inputValue})
        setContents(history)
        let body = {
            chatId: currChat.current,
            content: inputValue,
            engineId: model.current,
        }
        console.log(body)
        fetchStream(APIS.CHAT_API, body,
            function (value: AllowSharedBufferSource | undefined) {
                const val = new TextDecoder().decode(value);
                try {
                    let parse = JSON.parse(val);
                    if (parse.code == 500) {
                        cache = parse.msg
                    }
                } catch (e) {
                    cache = cache + val
                } finally {
                    let d = [...history]

                    d.push({
                        img: "",
                        auth: GPT,
                        content: cache,
                    })
                    setContents(d)
                    // 每次收到字符，滚动到最后
                    scrollToBottom()
                }
            },
            function () {
                console.log('done')
            }
        ).then(r => {
            scrollToBottom()
        })
        setInputValue("")
        // @ts-ignore
        console.log("scrollRef ", scrollRef.current.childNodes)
    }

    function sayHello() {
        let cache = ""
        let history = [...contents]
        let content = "你好"
        let body = {
            chatId: currChat.current,
            content: content,
            engineId: model.current,
        }
        fetchStream(APIS.CHAT_API, body,
            function (value: AllowSharedBufferSource | undefined) {
                const val = new TextDecoder().decode(value);
                cache = cache + val
                let d = [...history]
                d.push({
                    img: "",
                    auth: GPT,
                    content: cache,
                })
                setContents(d)
            },
            function () {
                console.log('done')
            }
        ).then(r => {
        })
        setInputValue("")
    }

    const getChats = () => {
        POST(APIS.GET_CHATS_API, {}).then(res => {
            console.log(res)
            if (res.code == 200) {
                if (res.data.chats.length == 0) {
                    createChat()
                }
            } else {
                toast({
                    title: "请求失败",
                    description: res.msg,
                })
                router.push("/auth/login")
            }
        })
    }

    const createChat = () => {
        POST(APIS.CREATE_CHAT_API, {}).then(res => {
            if (res.code == 200) {
                currChat.current = res.data.chat.id
                sayHello()
            } else {
                toast({
                    title: "请求失败",
                    description: res.msg,
                })
            }
        })
    }

    const modelChange = (val: string) => {
        model.current = val
    }

    return (
        <>
            <TopBar></TopBar>
            <div className={"flex flex-col chat items-center"}>
                <div className={"content w-80vw"}>
                    <ScrollArea className="scoll rounded-md" ref={scrollRef}>
                        <div ref={chatCardRef}>
                            {contents.map((item, index) => {
                                return <div className={"p-3 m-b-10 flex flex-col"} key={index}>
                                    <Separator className={"m-b-10"}
                                               style={{display: index == 0 ? "none" : "block"}}/>
                                    <div className={"flex flex-row m-b-10  items-center"}>
                                        <Avatar>
                                            <AvatarImage src={item.img}/>
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div style={{
                                            fontSize: "larger",
                                            fontWeight: "bolder",
                                            marginLeft: "10px"
                                        }}>{item.auth}</div>
                                    </div>
                                    {/*<Markdown className={"markdown m-t-10"} rehypePlugins={[]}>{item.content}</Markdown>*/}
                                    <Viewer value={item.content}/>
                                    {/*{item.content}*/}
                                </div>
                            })}
                            <div style={{height: "20vh"}}></div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
            <Card className={"bottombar flex flex-col items-center"}>
                <div className="flex flex-row m-t-24 m-b-24">
                    <div className={"mr-2"}>
                        <Select defaultValue={model.current} onValueChange={modelChange}>
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
                    <Input type="text" className="inputDemo input " value={inputValue} onChange={e => {
                        setInputValue(e.target.value);
                    }}/>
                    <Button className={"m-h-12"} onClick={click}>提问</Button>
                </div>
            </Card>
        </>
    )
}