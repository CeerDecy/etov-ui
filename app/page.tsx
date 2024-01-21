'use client'

import {TopBar} from "@/components/topbar/topbar"
import {Button} from "@/components/ui/button";
import { useRouter } from 'next/navigation'

export default function Home() {
    const router = useRouter()
    return (
        <main className="">
            <TopBar avatar="https://github.com/CeerDecy.png"></TopBar>
            <Button className={"m-h-12"} onClick={()=>router.push('/tools/chat')}>sxx</Button>
        </main>
    )
}
