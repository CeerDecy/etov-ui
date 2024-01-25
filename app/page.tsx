'use client'

import {TopBar} from "@/components/topbar/topbar"
import { useRouter } from 'next/navigation'
import {useEffect, useRef} from "react";
import "./index.css"

export default function Home() {
    const router = useRouter()
    const initialized = useRef(false)
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            router.push("/gallery")
        }
    }, []);
    return (
        <main className="">
            {/*<TopBar avatar="https://github.com/CeerDecy.png"></TopBar>*/}
            {/*<div className="h-[300px] flex flex-col items-center justify-center">*/}
            {/*    <div className={"welcome"}>欢迎使用 etov</div>*/}
            {/*</div>*/}
        </main>
    )
}
