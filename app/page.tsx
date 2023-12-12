'use client'
import {useEffect, useRef, useState} from "react";
import {GET} from "@/utils/http";
import {fetchStream} from "@/utils/stream";
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {ScrollArea} from "@/components/ui/scroll-area"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import {Separator} from "@/components/ui/separator"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import remarkGfm from 'remark-gfm'

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
    const chatCardRef = useRef(null);
    const scrollRef = useRef(null);
    const initialized = useRef(false)
    useEffect(() => {
        if (!initialized.current){
            initialized.current = true
            Hello()
        }
    }, []);
    function scrollToBottom() {
        // @ts-ignore
        // chatCardRef.current.scrollTop = chatCardRef.current.scrollHeight;
        // @ts-ignore
        const last = chatCardRef.current.childNodes.length-1
        // @ts-ignore
        chatCardRef.current.childNodes[last].scrollIntoView({ block: "end" })
    }

    async function Click() {
        let cache = ""
        let history = [...contents]
        history.push({img: "https://github.com/CeerDecy.png", auth: You, content: inputValue})
        setContents(history)
        fetchStream('/api/chat?content=' + inputValue, {method: 'get', headers: {'Content-Type': 'application/json'}},
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
        console.log("scrollRef ",scrollRef.current.childNodes)
    }

    function Hello() {
        let cache = ""
        let history = [...contents]
        let content = "欢迎一下江苏第二师范学院的同学"
        fetchStream('/api/chat?content='+content, {method: 'get', headers: {'Content-Type': 'application/json'}},
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
    return (
        <main className="">
            <div className={"topBar flex items-center justify-between"}>
                <div className={"etov"}>etov</div>
                <Avatar>
                    <AvatarImage src="https://github.com/CeerDecy.png"/>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
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
                            <div style={{height:"20vh"}}></div>
                        </div>
                    </ScrollArea>
                </div>

            </div>
            <Card className={"bottombar flex flex-col items-center"}>
                <div className="flex flex-row m-t-24 m-b-24">
                    <Input type="text" className="inputDemo input " value={inputValue} onChange={e => {
                        setInputValue(e.target.value);
                    }}/>
                    <Button className={"m-h-12"} onClick={Click}>提问</Button>
                </div>
            </Card>

        </main>
    )
}
