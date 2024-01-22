'use client'

import {useRouter} from "next/navigation";
import {TopBar} from "@/components/topbar/topbar";
import {ScrollArea} from "@/components/ui/scroll-area";
import {GitHubLogoIcon} from '@radix-ui/react-icons'
import "./index.css"
import {Button} from "@/components/ui/button";
import {ToolsGalleryItem} from "@/components/tools-gallery-item/tools-gallery-item";

export default function Gallery() {
    const router = useRouter()
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
                            <ToolsGalleryItem/>
                            <ToolsGalleryItem/>
                            <ToolsGalleryItem/>
                            <ToolsGalleryItem/>
                            <ToolsGalleryItem/>
                            <ToolsGalleryItem/>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </main>
    )
}