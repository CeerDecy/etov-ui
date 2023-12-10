'use client'
import Image from 'next/image'
import {GET} from "@/utils/http";
import {useState} from "react";
import {fetchStream} from "@/utils/stream";

const axios = require('axios');

const source = axios.CancelToken.source();


export default function Home() {
    const [a, b] = useState("回答：");
    const [inputValue, setInputValue] = useState("");

    function Click() {
        var str = "回答："
        fetchStream('/api/chat?content='+inputValue, {method: 'get', headers: {'Content-Type': 'application/json'}},
            function (value) {
                const val = new TextDecoder().decode(value);
                str = str + val
                b(str)
            },
            function () {
                console.log('done')
            }
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {a}
            <div className="flex flex-row ">
                <input type="text" className="inputDemo" value={inputValue} onChange={e => {
                    setInputValue(e.target.value);
                }}/>
                <button onClick={Click}>提问</button>
            </div>
        </main>
    )
}
