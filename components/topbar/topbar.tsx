"use client"
import * as React from "react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import "./index.css"

type Props = {
    avatar: string
};


export const TopBar: React.FC<Props> = ({avatar}) => {
    return <div className={"topBar flex items-center justify-between"}>
        <div className={"etov items-center flex flex-row"}>
            <div className={"m-l-10"}>etov</div>
        </div>
        <Avatar>
            <AvatarImage src={avatar}/>
            <AvatarFallback>avatar</AvatarFallback>
        </Avatar>
    </div>
}
TopBar.displayName = "TopBar";