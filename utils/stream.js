export const fetchStream =  async (url, body,onmessage,ondone) => {
    let token = localStorage.getItem("Authorization")
    const response = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(body)
    });
    const reader = response.body.getReader();
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            ondone();
            break; // 读取完毕
        } else {
            onmessage(value)
        }
    }
};