export const fetchStream =  async (url, options,onmessage,ondone) => {
    const response = await fetch(url, options);
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