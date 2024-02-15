"use client"
import * as React from "react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import "./index.css"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button";
import {useEffect, useRef, useState} from "react";
import {GET, BaseUrl} from "@/utils/http";
import {APIS} from "@/api/api";
import {useRouter} from "next/navigation";
import {PersonIcon} from "@radix-ui/react-icons";
import {Badge} from "@/components/ui/badge";

type Props = {
    avatar?: string
};
type UserInfo = {
    apiKey: string
    avatar: string
    email: string
    id: number
    nickName: string
    phone: string
    validate: boolean
}

export const TopBar: React.FC<Props> = ({avatar}) => {
    const [userInfo, setUserInfo] = useState<UserInfo>({
        avatar: "",
        apiKey: "",
        email: "",
        id: 0,
        nickName: "",
        phone: "",
        validate: false
    })
    const initialized = useRef(false)
    const router = useRouter()
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            getUserInfo()
        }
    }, []);

    const getUserInfo = () => {
        GET(APIS.GET_USER_INFO, {}).then(res => {
            if (res.code === 200) {
                setUserInfo(res.data)
            }
        })
    }

    const logout = () => {
        localStorage.removeItem("Authorization")
        setUserInfo({avatar: "", apiKey: "", email: "", id: 0, nickName: "", phone: "", validate: false})
        router.push("/")
    }

    return <div className={"topBar flex items-center justify-between"}>
        <div className={"etov items-center flex flex-row cursor-pointer"} onClick={() => router.push("/")}>
            <div className={"m-l-10"}>etov</div>
            <Badge className={"ml-1"} style={{fontSize: 10, height: 18}}>测试</Badge>
        </div>
        <div className={"flex  items-center flex-row"}>
            <div>
                <Button variant="link">
                    <div className={"topbar-username"}>
                        {userInfo.nickName == "" ?
                            <div onClick={() => router.push("/ai/auth/login")}>登录</div>
                            : <div>{userInfo.nickName}</div>}
                    </div>
                </Button>
            </div>
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        {userInfo.nickName == "" ? "" :
                            <Avatar className={"action-hover"}>
                                <AvatarImage src={BaseUrl + userInfo.avatar}/>
                                <AvatarFallback>
                                    <PersonIcon/>
                                </AvatarFallback>
                            </Avatar>
                        }
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>欢迎来到etov</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                个人中心
                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                钱包
                                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                设置
                                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>工具箱</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem>Email</DropdownMenuItem>
                                        <DropdownMenuItem>Message</DropdownMenuItem>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem>More...</DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>关于</DropdownMenuItem>
                        <DropdownMenuItem>支持</DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={logout}>
                            退出登录
                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    </div>
}
TopBar.displayName = "TopBar";