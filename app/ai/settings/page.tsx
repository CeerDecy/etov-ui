'use client'
import {TopBar} from "@/components/topbar/topbar";
import "./index.css"
import {Separator} from "@/components/ui/separator";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import {CheckIcon, Pencil2Icon, TrashIcon, PlusIcon} from "@radix-ui/react-icons";
import {
    Drawer,
    DrawerContent,
    DrawerTitle,
    DrawerTrigger,
    DrawerHeader,
    DrawerFooter,
} from "@/components/ui/drawer";
import {Label} from "@/components/ui/label";
import {useEffect, useRef, useState} from "react";
import {Switch} from "@/components/ui/switch";
import {GET, POST} from "@/utils/http";
import {APIS} from "@/api/api";
import {useToast} from "@/components/ui/use-toast";

type Token = {
    id: number,
    name: string,
    token: string,
    host: string,
    model: string
}
export default function SettingsPage() {
    const initialized = useRef(false)
    const [isOpenAI, setIsOpenAI] = useState(false)
    const [tokens, setTokens] = useState(Array<Token>())
    const [NewName, SetNewName] = useState("")
    const [NewToken, SetNewToken] = useState("")
    const [NewHost, SetNewHost] = useState("https://api.openai.com/v1")
    const [NewModel, SetNewModel] = useState("")
    const {toast} = useToast()
    const modelMap = new Map<string, string>();

    const [editName, setEditName] = useState("")
    const [editToken, setEditToken] = useState("")
    const [editHost, setEditHost] = useState("")
    const [editModel, setEditModel] = useState("")

    const models = [
        {key: "gpt-3.5-turbo", value: "GPT-3.5-Turbo"},
        {key: "gpt-3.5-turbo-1106", value: "GPT-3.5-Turbo-1106"},
        {key: "gpt-3.5-turbo-16k", value: "GPT-3.5-Turbo-16K"},
        {key: "gpt-3.5-turbo-16k-0613", value: "GPT-3.5-Turbo-16K-0613"},
        {key: "gpt-4", value: "GPT-4"},
        {key: "gpt-4-turbo-preview", value: "GPT-4-Turbo-Preview"},
        {key: "gpt-4-32k-0613", value: "GPT-4-32K-0613"},
        {key: "gpt-4-32k-0314", value: "GPT-4-32K-0314"},
        {key: "gpt-4-32k", value: "GPT-4-32K"},
        {key: "gpt-4-0613", value: "GPT-4-0613"},
        {key: "gpt-4-0314", value: "GPT-4-0314}"}
    ]

    models.forEach((item) => {
        modelMap.set(item.key, item.value);
    });

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            document.title = "设置"
            GetTokens()
        }
    }, []);

    const SaveAPIKey = () => {
        let body = {
            token_name: NewName,
            token: NewToken,
            host: NewHost,
            model_tag: NewModel,
        }
        if (body.token_name == "" || body.token == "" || body.host == "" || body.model_tag == "") {
            toast({
                title: "无法保存",
                description: "请将Token信息填写完整",
            })
            return
        }
        POST(APIS.CREATE_APIKEY, body).then(res => {
            if (res.code === 200) {
                toast({
                    title: "保存成功"
                })
                GetTokens()
            } else {
                toast({
                    title: "保存失败",
                    description: res.msg,
                })
            }
        })
        SetNewModel("")
        SetNewHost("https://api.openai.com/v1")
        SetNewToken("")
        SetNewName("")
    }

    const GetTokens = () => {
        GET(APIS.GET_APIKEY).then(res => {
            if (res.code === 200) {
                console.log(res.data)
                setTokens(res.data.APIKeys)
            } else {
                toast({
                    title: "获取失败",
                    description: res.msg,
                })
            }
        })
    }

    const UpdateToken = (id: number) => {
        let body = {
            id: id,
            name: editName,
            token: editToken,
            host: editHost,
            model: editModel,
        }
        if (body.name == "" || body.token == "" || body.host == "" || body.model == "") {
            toast({
                title: "无法保存",
                description: "请将Token信息填写完整",
            })
            return
        }
        POST(APIS.UPDATE_APIKEY, body).then(res => {
            if (res.code === 200) {
                toast({
                    title: "保存成功"
                })
                GetTokens()
            } else {
                toast({
                    title: "保存失败",
                    description: res.msg,
                })
            }
        })
    }

    const DeleteToken = (id: number) => {
        POST(APIS.DELETE_APIKEY, {id: id}).then(res => {
            if (res.code === 200) {
                toast({
                    title: "删除成功"
                })
                GetTokens()
            } else {
                toast({
                    title: "删除失败",
                    description: res.msg,
                })
            }
        })
    }

    return (<>
        <TopBar/>
        <div className={"flex flex-col chat items-start container"}>
            <h1 className={"text-3xl font-bold mb-4 mt-10"}>设置 Settings</h1>
            <Separator/>
            <div className={"flex flex-row justify-between child h-[48px] items-center"}>
                <h2 className={"text-1xl font-bold mb-4 mt-4"}>管理Tokens</h2>
                {/*<Button size={"sm"} variant={"ghost"}><PlusIcon/></Button>*/}
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button variant={"ghost"}><PlusIcon/></Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader>
                                <DrawerTitle>添加一个API TOKEN</DrawerTitle>
                            </DrawerHeader>
                            <div className={"pl-4 pr-4"}>
                                <Label htmlFor="name">API名称</Label>
                                <Input id="name" className={"w-[120px] mb-2"} placeholder={"API名称"} value={NewName}
                                       onChange={(e) => {
                                           SetNewName(e.target.value)
                                       }}/>
                                <Label htmlFor="token">Token</Label>
                                <Input id="token" placeholder={"输入Token"} className={"mb-2"} value={NewToken}
                                       onChange={(e) => {
                                           SetNewToken(e.target.value)
                                       }}/>
                                <div className={"flex flex-row items-center mb-1 mt-1"}>
                                    <Switch id="airplane-mode" className={"mr-1"} onCheckedChange={() => {
                                        console.log(isOpenAI)
                                        setIsOpenAI(!isOpenAI)
                                    }}/>
                                    <Label htmlFor="airplane-mode">非OpenAI接口</Label>
                                </div>
                                <Input id="host" disabled={!isOpenAI} placeholder={"API地址"} className={"mb-2"}
                                       value={NewHost}
                                       onChange={(e) => {
                                           SetNewHost(e.target.value)
                                       }}/>

                                <Label>Model</Label>
                                <Select onValueChange={(val) => {
                                    SetNewModel(val)
                                }}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="选择一个模型"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>GPT-3.5</SelectLabel>
                                            <SelectItem value={"gpt-3.5-turbo"}>GPT-3.5-Turbo</SelectItem>
                                            <SelectItem value={"gpt-3.5-turbo-1106"}>GPT-3.5-Turbo-1106</SelectItem>
                                            <SelectItem value={"gpt-3.5-turbo-16k"}>GPT-3.5-Turbo-16K</SelectItem>
                                            <SelectItem
                                                value={"gpt-3.5-turbo-16k-0613"}>GPT-3.5-Turbo-16K-0613</SelectItem>
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>GPT-4.0</SelectLabel>
                                            <SelectItem value={"gpt-4"}>GPT-4</SelectItem>
                                            <SelectItem value={"gpt-4-turbo-preview"}>GPT-4-Turbo-Preview</SelectItem>
                                            <SelectItem value={"gpt-4-32k-0613"}>GPT-4-32K-0613</SelectItem>
                                            <SelectItem value={"gpt-4-32k-0314"}>GPT-4-32K-0314</SelectItem>
                                            <SelectItem value={"gpt-4-32k"}>GPT-4-32K</SelectItem>
                                            <SelectItem value={"gpt-4-0613"}>GPT-4-0613</SelectItem>
                                            <SelectItem value={"gpt-4-0314"}>GPT-4-0314</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DrawerFooter>
                                <Button variant="default" onClick={SaveAPIKey}><CheckIcon/></Button>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
            <div className={"flex flex-row justify-between child h-[48px] items-center"}>
                <div className={"flex flex-row"}>
                    <div className={"w-[120px] text"} style={{padding: "10px"}}>my-token</div>
                    <div className={"ml-1 mr-1 w-[300px] text"} style={{padding: "10px"}}>
                        d3e82*******************nsdu32
                    </div>
                    <div className={"ml-1 mr-1 w-[180px] text"} style={{padding: "10px"}}>GPT-4-Turbo</div>
                </div>
                <div className={"flex flex-row"}>
                    <Button className={"mr-1"} variant={"ghost"}><Pencil2Icon/></Button>
                    <Button className={"mr-1"} variant={"ghost"}><TrashIcon/></Button>
                    {/*<Button className={"mr-1"} variant={"ghost"}><CheckIcon/></Button>*/}
                </div>
            </div>

            {tokens.map((item, index) => {
                return <div key={index} className={"flex flex-row justify-between child h-[48px] items-center"}>
                    <div className={"flex flex-row"}>
                        <div className={"w-[120px] text"} style={{padding: "10px"}}>{item.name}</div>
                        <div className={"ml-1 mr-1 w-[300px] text"} style={{padding: "10px"}}>
                            {item.token}
                        </div>
                        <div className={"ml-1 mr-1 w-[280px] text"}
                             style={{padding: "10px"}}>{modelMap.get(item.model)}</div>
                    </div>
                    <div className={"flex flex-row"}>
                        <Drawer>
                            <DrawerTrigger asChild>
                                <Button className={"mr-1"} variant={"ghost"} onClick={() => {
                                    setEditName(item.name)
                                    setEditHost(item.host)
                                    setEditModel(item.model)
                                    setEditToken(item.token)
                                }}><Pencil2Icon/></Button>
                            </DrawerTrigger>
                            <DrawerContent>
                                <div className="mx-auto w-full max-w-sm">
                                    <DrawerHeader>
                                        <DrawerTitle>修改您的API TOKEN</DrawerTitle>
                                    </DrawerHeader>
                                    <div className={"pl-4 pr-4"}>
                                        <Label htmlFor="name">API名称</Label>
                                        <Input id="name" className={"w-[120px] mb-2"} placeholder={"API名称"}
                                               value={editName}
                                               onChange={(e) => {
                                                   setEditName(e.target.value)
                                               }}/>
                                        <Label htmlFor="token">Token</Label>
                                        <Input id="token" placeholder={"输入Token"} className={"mb-2"}
                                               value={editToken}
                                               onChange={(e) => {
                                                   setEditToken(e.target.value)
                                               }}/>
                                        <Label htmlFor="host">API地址</Label>
                                        <Input id="host" placeholder={"API地址"} className={"mb-2"}
                                               value={editHost}
                                               onChange={(e) => {
                                                   setEditHost(e.target.value)
                                               }}/>

                                        <Label>Model</Label>
                                        <Select onValueChange={(val) => {
                                            setEditModel(val)
                                        }} defaultValue={editModel}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="选择一个模型"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>GPT-3.5</SelectLabel>
                                                    <SelectItem value={"gpt-3.5-turbo"}>GPT-3.5-Turbo</SelectItem>
                                                    <SelectItem
                                                        value={"gpt-3.5-turbo-1106"}>GPT-3.5-Turbo-1106</SelectItem>
                                                    <SelectItem
                                                        value={"gpt-3.5-turbo-16k"}>GPT-3.5-Turbo-16K</SelectItem>
                                                    <SelectItem
                                                        value={"gpt-3.5-turbo-16k-0613"}>GPT-3.5-Turbo-16K-0613</SelectItem>
                                                </SelectGroup>
                                                <SelectGroup>
                                                    <SelectLabel>GPT-4.0</SelectLabel>
                                                    <SelectItem value={"gpt-4"}>GPT-4</SelectItem>
                                                    <SelectItem
                                                        value={"gpt-4-turbo-preview"}>GPT-4-Turbo-Preview</SelectItem>
                                                    <SelectItem value={"gpt-4-32k-0613"}>GPT-4-32K-0613</SelectItem>
                                                    <SelectItem value={"gpt-4-32k-0314"}>GPT-4-32K-0314</SelectItem>
                                                    <SelectItem value={"gpt-4-32k"}>GPT-4-32K</SelectItem>
                                                    <SelectItem value={"gpt-4-0613"}>GPT-4-0613</SelectItem>
                                                    <SelectItem value={"gpt-4-0314"}>GPT-4-0314</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <DrawerFooter>
                                        <Button variant="default" onClick={() => {
                                            UpdateToken(item.id)
                                        }}><CheckIcon/></Button>
                                    </DrawerFooter>
                                </div>
                            </DrawerContent>
                        </Drawer>
                        <Button className={"mr-1"} variant={"ghost"} onClick={() => {
                            DeleteToken(item.id)
                        }}><TrashIcon/></Button>
                        {/*<Button className={"mr-1"} variant={"ghost"}><CheckIcon/></Button>*/}
                    </div>
                </div>
            })}


        </div>
    </>)
}