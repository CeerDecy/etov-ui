'use client'

import {useRouter} from "next/navigation";
import {TopBar} from "@/components/topbar/topbar";
import {ScrollArea} from "@/components/ui/scroll-area";
import {GitHubLogoIcon} from '@radix-ui/react-icons'
import "./index.css"
import {Button} from "@/components/ui/button";
import {ToolsGalleryItem} from "@/components/tools-gallery-item/tools-gallery-item";
import {useEffect, useRef, useState} from "react";
import {GET} from "@/utils/http";
import {APIS} from "@/api/api";

type ToolInfo = {
    name: string
    description: string,
    logo: string,
    url: string,
    params: string,
    disable: boolean,
}

export default function Gallery() {
    const [tools, setTools] = useState(Array<ToolInfo>());
    const router = useRouter()
    const initialized = useRef(false)

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            document.title = "gallery"
            getTools()
        }
    }, []);

    const getTools = () => {
        GET(APIS.GET_PUBLIC_TOOLS,"").then(res=>{
            if (res.code === 200 ){
                setTools(res.data)
            }
        })
    }
    return (
        <main className="">
            <TopBar avatar="https://github.com/CeerDecy.png"></TopBar>
            <div
                className="h-[300px] flex flex-col items-center justify-center">
                <div className={"title"}>Check out some etov-tools</div>
                <div
                    className={"minor-content"}>AI翻译、论文降重、文本生成……使用AI构建的一些工具。按照自己的需求，选择合适的工具体验吧。
                </div>
                <a href={"https://github.com/CeerDecy/etov"}>
                    <Button variant="outline" className={"m-t-24"}>
                        <GitHubLogoIcon className={"m-r-10"}/>
                        <div>GitHub</div>
                    </Button>
                </a>
            </div>
            <div>
                <div className={"flex flex-col items-center"}>
                    <div className={"content w-80vw"}>
                        <ScrollArea className="scoll rounded-md">
                            <div className={"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2"}>
                                {tools.map(
                                    (tool, index) => (
                                        <ToolsGalleryItem
                                            key={index}
                                            name={tool.name}
                                            link={tool.url}
                                            params={tool.params}
                                            logo={tool.logo}
                                            description={tool.description}
                                            disabled={tool.disable}
                                        />
                                    )
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </main>
    )
}