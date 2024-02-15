'use client'

import { useRouter } from 'next/navigation'
import {useEffect, useRef} from "react";

export default function AI() {
    const router = useRouter()
    const initialized = useRef(false)
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            router.push("/ai/gallery")
        }
    }, []);
    return (
        <main className="">
        </main>
    )
}
