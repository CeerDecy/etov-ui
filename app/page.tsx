'use client'
import { useState } from "react";
import {GET} from "@/utils/http";
import {fetchStream} from "@/utils/stream";
// import {fetchStream} from "@/utils/stream";

export default function Home() {
  const [a, b] = useState("回答：");
  const [inputValue, setInputValue] = useState("");

  function Click() {
    var str = "回答："
    fetchStream('/api/chat?content=' + inputValue, {method: 'get', headers: {'Content-Type': 'application/json'}},
        function (value: AllowSharedBufferSource | undefined) {
          const val = new TextDecoder().decode(value);
          str = str + val
          b(str)
        },
        function () {
          console.log('done')
        }
    ).then(r =>{
      console.log(r)
    });
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
