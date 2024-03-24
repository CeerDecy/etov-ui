"use client"

import * as React from "react";
import {Button, buttonVariants} from "@/components/ui/button";
import {useRef, useState} from "react";
import {cn} from "@/lib/utils";

type MenusItem = {
    title: string
    icon: string
}

type MenusProps = {
    data: Array<MenusItem>
    defIndex: number
    onSelect: (index: number) => void
}

export const Menus: React.FC<MenusProps> = ({data, defIndex, onSelect}) => {
    const selectIndex = useRef(0)
    // const status = useRef<boolean>(false)
    const [status, setStatus] = useState(Array<string>)
    const initialized = useRef(false)
    // setStatus(new Array(data.length).fill(false))
    if (!initialized.current) {
        for (let i = 0; i < data.length; i++) {
            if (i === defIndex) {
                status.push(cn(buttonVariants({
                    variant: "default",
                    size: "default"
                })))
                continue
            }
            status.push(cn(buttonVariants({
                variant: "ghost",
                size: "default"
            })))
        }
        initialized.current = true
    }

    React.useEffect(() => {
        if (data) {
            onSelect(defIndex)
            selectIndex.current = defIndex
        }
    }, [data])

    const changeStatus = (index: number) => {
        let temp = status
        temp[selectIndex.current] = cn(buttonVariants({
            variant: "ghost",
            size: "default"
        }))
        temp[index] = cn(buttonVariants({
            variant: "default",
            size: "default"
        }))
        setStatus(temp)
    }

    const onChange = (index: number) => {
        changeStatus(index)
        onSelect(index)
        selectIndex.current = index
        console.log("change....", status)
    }

    return <div className={"flex flex-col"}>
        {data?.map((item, index) => {
            return <Button key={index}
                           className={status[index]}
                           onClick={() => {
                               onChange(index)
                           }}>{item.title}</Button>
        })}
    </div>
}

Menus.displayName = "Menus";