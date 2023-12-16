"use client"
import * as React from "react"
import {Button} from "@/components/ui/button"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {ChatBubbleIcon} from "@radix-ui/react-icons"


type OpenChatsFunc = () => void
type Props = {
    avatar: string,
    openChats ?: OpenChatsFunc
};

export const TopBar: React.FC<Props> = ({ avatar,openChats}) => (
        <div className={"topBar flex items-center justify-between"}>
            <div className={"etov items-center flex flex-row"}>
                <Button variant="outline" className={"iconBtn"} onClick={openChats}>
                    <ChatBubbleIcon color="#838383" className="h-4 w-4"/>
                </Button>
                <div className={"m-l-10"}>etov</div>
            </div>
            <Avatar>
                <AvatarImage src={avatar}/>
                <AvatarFallback>avatar</AvatarFallback>
            </Avatar>
        </div>
);
TopBar.displayName = "TopBar";