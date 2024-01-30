"use client"

import * as React from "react";
import Image from "next/image";
import {BaseUrl} from "@/utils/http";
import "./index.css"
import {useRouter} from "next/navigation";

type GalleryItemProps = {
    logo: string,
    name: string,
    description: string,
    link?: string,
    disabled?: boolean,
}

export const ToolsGalleryItem: React.FC<GalleryItemProps> = ({logo,name,description,link,disabled}) => {
    const router = useRouter();
    const onClick = () => {
        console.log(link)
        if (link !== "" && !disabled){
            router.push(""+link)
        }
    }

    return <div onClick={onClick} className={"flex items-center item-container p-2 hover:bg-gray-200 rounded-md " + (disabled ? " cursor-not-allowed opacity-50" : "cursor-pointer ")}>
            <div className={"mr-2"}>
                <Image className={"item-icon"} src={BaseUrl + logo} alt={""} width={55} height={55}/>
            </div>
            <div className={"flex flex-col"}>
                <div className={"item-title singe-line"}>{name}</div>
                <div className={"summary singe-line"}>{description}</div>
            </div>
    </div>
}
ToolsGalleryItem.displayName = "ToolsGalleryItem";