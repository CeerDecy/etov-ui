'use client'
import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {GET, POST} from "@/utils/http";
import {fetchStream} from "@/utils/stream";
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {TopBar, ChatItem, ChatItemProps} from "@/components/topbar/topbar"
import {ScrollArea} from "@/components/ui/scroll-area"
import {
    Card
} from "@/components/ui/card"
import Markdown from 'react-markdown'
import {Separator} from "@/components/ui/separator"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {ChatBubbleIcon} from "@radix-ui/react-icons"
import {GetCache, SetCache} from "@/utils/cache";

const GPT = "GPT3.5"
const You = "You"
type Message = {
    img: string
    auth: string
    content: string
}

export default function Home() {
    const [contents, setContents] = useState(Array<Message>());
    const [inputValue, setInputValue] = useState("");
    const [chatList, setChatList] = useState(Array<ChatItem>());
    const chatCardRef = useRef(null);
    const scrollRef = useRef(null);
    const initialized = useRef(false)
    const currChat = useRef("")

    // let currChat = ""
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            getChats()
        }
    }, []);

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
        }
        console.log(body)
        fetchStream('/api/chat', body,
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
                // 每次收到字符，滚动到最后
                scrollToBottom()
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
        }
        fetchStream('/api/chat', body,
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
        POST("/chat/get/chats", {}).then(res =>{
            if (res.code == 200) {
                if (res.data.chats.length == 0) {
                    createChatId()
                }
            }
        })
    }

    /**
     * 请求创建ChatId
     */
    function createChatId() {
        POST("/chat/create/chatId", {}).then(res => {
            if (res.code == 200) {
                console.log(res.data)
                let lists = Array<ChatItem>();
                lists.push({
                    id:res.data.chat.id,
                    chatId:res.data.chat.id,
                    title:res.data.chat.title,
                })
                setChatList(lists)
                currChat.current = res.data.chat.id
                sayHello()
            }
        })
    }

    function f() {
        console.log("click")
    }

    return (
        <main className="">
            <TopBar
                avatar="https://github.com/CeerDecy.png"
                openChats={f}
                chatList={chatList}
                onChangeChat={(i)=>console.log("onChangeChat ==> ",i)}></TopBar>
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
                                    <Markdown className={"markdown m-t-10"} rehypePlugins={[]}>{item.content}</Markdown>
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
                    <Input type="text" className="inputDemo input " value={inputValue} onChange={e => {
                        setInputValue(e.target.value);
                    }}/>
                    <Button className={"m-h-12"} onClick={click}>提问</Button>
                </div>
            </Card>

        </main>
    )
}
