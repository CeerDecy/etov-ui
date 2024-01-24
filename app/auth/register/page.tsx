"use client"
import Image from "next/image"
import Link from "next/link"
import {cn} from "@/lib/utils"
import {Button, buttonVariants} from "@/components/ui/button";
import "./index.css"
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Icons} from "@/components/icons/icon";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {POST} from "@/utils/http";
import {useToast} from "@/components/ui/use-toast"
import {Md5} from 'ts-md5';
import {useRouter} from "next/navigation";
import {APIS} from "@/api/api";

export default function UserRegisterPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [account, setAccount] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [step, setStep] = useState<number>(0)
    const initialized = useRef(false)
    const {toast} = useToast()
    const router = useRouter()

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            document.title = "Authentication"
        }
    }, []);

    async function onWeChatLogin(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)
        toast({
            title: "无法登录",
            description: "此功能尚未开放噢",
        })
        setTimeout(() => {
            setIsLoading(false)
        }, 3000)
    }

    async function onContinue(event: React.SyntheticEvent) {
        event.preventDefault()
        if (step === 0) {
            if (account === "") {
                toast({
                    title: "无法登录",
                    description: "当前邮箱地址不能为空",
                })
                return
            }
            console.log(password)
            let body = {
                email: account
            }
            setIsLoading(true)
            POST(APIS.HAS_REGISTER_API, body).then(res => {
                if (res.code === 200) {
                    if (res.data.flag) {
                        toast({
                            title: "无法登录",
                            description: "当前邮箱已被注册",
                        })
                    } else {
                        setStep(1)
                    }
                }
                setIsLoading(false)
            })
        } else {
            if (password === "") {
                toast({
                    title: "无法登录",
                    description: "当前密码不能为空",
                })
                return
            }
            const pwd = Md5.hashStr(password)
            POST(APIS.REGISTER_API, {
                account: account,
                password: pwd
            }).then(res => {
                if (res.code == 200) {
                    toast({
                        title: "注册成功",
                        description: "注册方式为" + res.data.mode,
                    })
                    router.push("/auth/login")
                }else {
                    toast({
                        title: "注册失败",
                        description: res.msg,
                    })
                }
            })
        }
    }

    return (
        <>
            <div className="md:hidden">
                <Image
                    src=""
                    width={1280}
                    height={843}
                    alt="Authentication"
                    className="block dark:hidden"
                />
                <Image
                    src=""
                    width={1280}
                    height={843}
                    alt="Authentication"
                    className="hidden dark:block"
                />
            </div>
            <div
                className="container relative hidden h-[100vh] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <Link
                    href="/auth/login"
                    className={cn(
                        buttonVariants({variant: "ghost"}),
                        "absolute right-4 top-4 md:right-8 md:top-8"
                    )}
                >
                    登录
                </Link>
                <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                    <div className="absolute inset-0 bg-zinc-900"/>
                    <div className="relative z-20 flex items-center  font-medium">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-6 w-6"
                        >
                            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>
                        </svg>
                        welcome etovGPT
                    </div>
                    <div className={"relative z-20"}>
                        <div className={"etov_bg action-hover"} onClick={()=>router.push("/")}>etov</div>
                    </div>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="">
                                &ldquo;Learning to use GPT can quickly improve your learning and productivity!&rdquo;
                            </p>
                            <footer className="text-sm">CeerDecy</footer>
                        </blockquote>
                    </div>
                </div>
                <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                注册账户，属于你的etov
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                请在下方输入您的手机或电子邮件以注册账户
                            </p>
                        </div>
                        {/*<UserAuthForm />*/}
                        <div className={cn("grid gap-6")}>
                            <form onSubmit={onContinue}>
                                <div className="grid gap-2">
                                    <div className="grid gap-1">
                                        <Label className="sr-only" htmlFor="email">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            placeholder="您的手机号或邮箱地址"
                                            type="phone"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            autoCorrect="off"
                                            disabled={isLoading}
                                            value={account}
                                            onChange={e => setAccount(e.target.value)}
                                        />
                                    </div>
                                    {
                                        step == 1 && (
                                            <div className="grid gap-1">
                                                <Label className="sr-only" htmlFor="email">
                                                    密码
                                                </Label>
                                                <Input
                                                    id="pwd"
                                                    placeholder="密码"
                                                    type="password"
                                                    autoCapitalize="none"
                                                    autoComplete="email"
                                                    autoCorrect="off"
                                                    disabled={isLoading}
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                />
                                            </div>
                                        )
                                    }

                                    <Button disabled={isLoading}>
                                        {isLoading && (
                                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                                        )}
                                        {
                                            step == 0 ? (<div>继续</div>) : (<div>注册</div>)
                                        }
                                    </Button>
                                </div>
                            </form>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t"/>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            或
          </span>
                                </div>
                            </div>
                            <Button onClick={onWeChatLogin} variant="outline" type="button" disabled={isLoading}>
                                {isLoading ? (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                                ) : (
                                    <Icons.wechat className="mr-2 h-4 w-4"/>
                                )}{" "}
                                WeChat
                            </Button>
                        </div>
                        {/*<UserAuthForm/>*/}
                        <p className="px-8 text-center text-sm text-muted-foreground">
                            点击登录，即表示您同意我们的{" "}
                            <Link
                                href="/terms"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                服务条款
                            </Link>{" "}
                            和{" "}
                            <Link
                                href="/privacy"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                隐私政策
                            </Link>
                            。
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}