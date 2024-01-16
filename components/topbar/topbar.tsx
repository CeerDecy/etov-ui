"use client"
import * as React from "react"
import {Button} from "@/components/ui/button"
import Link from "next/link"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {ChatBubbleIcon, Pencil2Icon, CrossCircledIcon, PlusIcon} from "@radix-ui/react-icons"
import {Toggle} from "@/components/ui/toggle"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {Card} from "@/components/ui/card";
import "./index.css"
import {Separator} from "@/components/ui/separator";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";

type OpenChatsFunc = () => void
type NewChat = () => void
type OnChangeChat = (chat: ChatItem) => void
type Props = {
    avatar: string,
    chatList: ChatItem[],
    openChats?: OpenChatsFunc,
    onChangeChat?: OnChangeChat
    newChat?: NewChat
};

export type ChatItem = {
    id: number,
    chatId: string,
    title: string
}

export type ChatItemProps = {
    chatList: ChatItem[],
    setList: Dispatch<SetStateAction<ChatItem[]>>
}

export const TopBar: React.FC<Props> = ({avatar, openChats, chatList, onChangeChat, newChat}) => {
    const [hover, setHover] = useState(Array<boolean>)
    const [select, setSelect] = useState(Array<boolean>)
    for (let i = 0; i < chatList.length; i++) {
        if (hover.length < chatList.length) {
            hover.push(false)
        }
        if (select.length < chatList.length) {
            select.push(i == 0)
        }
    }
    const onHover = (index: number, bool: boolean) => {
        if (select[index]) {
            return
        }
        let temp = [...hover]
        for (let i = 0; i < chatList.length; i++) {
            if (i == index) {
                temp[i] = bool
                continue
            }
            temp[i] = false
        }
        setHover(temp)
    }

    const onValueChange = (sel: string) => {
        let temp = [...select]
        for (let i = 0; i < chatList.length; i++) {
            if (chatList[i].chatId === sel) {
                temp[i] = true
                if (onChangeChat) {
                    onChangeChat(chatList[i])
                }
                continue
            }
            temp[i] = false
        }
        setSelect(temp)

    }

    const onAddChat = () => {
        let hoverTemp = [...hover]
        hoverTemp.push(false)
        setHover(hoverTemp)
        let selectTemp = [...select]
        selectTemp.push(false)
        setSelect(selectTemp)
        select.push(false)
        if (newChat) {
            newChat()
        }
    }

    return <div className={"topBar flex items-center justify-between"}>
        <div className={"etov items-center flex flex-row"}>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className={"iconBtn"} onClick={openChats}>
                        <ChatBubbleIcon color="#838383" className="h-4 w-4"/>
                    </Button>
                </SheetTrigger>
                <SheetContent side={"left"}>
                    <SheetHeader>
                        <SheetTitle>SESSIONS LIST</SheetTitle>
                        <SheetDescription>
                            You can select a different list of sessions, each with a different context.
                            <Link
                                href="/privacy"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                What is context
                            </Link>
                            ?
                        </SheetDescription>
                    </SheetHeader>
                    <Separator className={"m-b-10 m-t-10"}/>
                    {/* overflow */}
                    <RadioGroup defaultValue={chatList.length > 0 ? chatList[0].chatId : ""} style={{display: "block"}}
                                onValueChange={onValueChange}>
                        {
                            chatList.map((item, index) => {
                                return <Card
                                    key={index}
                                    className={"chat-list-card m-b-10 flex flex-row justify-between items-center"}
                                    onMouseEnter={() => onHover(index, true)}
                                    onMouseLeave={() => onHover(index, false)}>
                                    <div className={"flex flex-row items-center singe-line"}>
                                        {(hover[index] || select[index]) && (
                                            <RadioGroupItem value={chatList[index].chatId} id={index + ""}
                                                            className={"m-r-10"}/>
                                        )}
                                        <div className={"singe-line"}>{item.title}</div>
                                    </div>
                                    <div className={"flex flex-row items-center"}>
                                        <Button variant="ghost" className={"iconBtn"}>
                                            <Pencil2Icon color="#838383" className="h-4 w-4"/>
                                        </Button>
                                        <Button variant="ghost" className={"iconBtn"}>
                                            <CrossCircledIcon color="#E5484D" className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                </Card>
                            })
                        }
                    </RadioGroup>
                    <Button variant="ghost" className={"plus_btn"} onClick={onAddChat}>
                        <PlusIcon color="#838383" className="h-4 w-4"/>
                    </Button>
                </SheetContent>
            </Sheet>
            <div className={"m-l-10"}>etov</div>
        </div>
        <Avatar>
            <AvatarImage src={avatar}/>
            <AvatarFallback>avatar</AvatarFallback>
        </Avatar>
    </div>
}
TopBar.displayName = "TopBar";