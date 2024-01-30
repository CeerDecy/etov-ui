import axios from "axios";
import {useRouter} from "next/navigation";

//这是使用代理的路径，如果你想了解的话可以看我之前的文章或者~~问我
const baseUrl = process.env.NEXT_PUBLIC_SERVER || "http://localhost"

export const BaseUrl = baseUrl
// 创建axios实例，在这里可以设置请求的默认配置
const instance = axios.create({
    timeout: 10000, // 设置超时时间10s，如果10秒没有返回结果则中断请求，认为连接超时
    baseURL: baseUrl // 根据自己配置的代理去设置不同环境的baseUrl
})

// 文档中的统一设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/json';

// 如果你是上传文件的话需要设置为
// instance.defaults.headers.post['Content-Type'] = 'multipart/form-data';

/** 添加请求拦截器 **/
instance.interceptors.request.use(config => {
    let token = localStorage.getItem("Authorization")
    // 判断cookie有没有存储token，有的话加入到请求头里
    if (token) {
        config.headers['Authorization'] = token//在请求头中加入token
    }
    // 如果还需要在请求头内添加其他内容可以自己添加 "[]" 内为自定义的字段名 "=" 后的内容为字段名对应的内容
    // config.headers['自定义键'] = '自定义内容'
    // 如果此时觉得某些参数不合理，你可以删除它，删除后将不会发送给服务器
    // delete config.data.userName
    // userName是你传递的参数名，或许你可以试着在控制台输出config看看它包含了什么

    // 对应可以删除也可以在此添加一些参数
    // config.data.userName = '天道酬勤'
    return config
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error)
})
/** 添加响应拦截器  **/
instance.interceptors.response.use(response => {
    if (response.statusText === 'OK') {
        return Promise.resolve(response.data)
    } else {
        return Promise.reject(response.data.msg)
    }
}, error => {
    // 请求报错的回调可以和后端协调返回什么状态码，在此根据对应状态码进行对应处理
    if (error.response) {
        // 如401我就让用户返回登录页
        if (error.response.status === 401) {
            // @ts-ignore
            // this.props.history.push('/login');
        }
        // 比如返回报错你的页面可能会崩溃，你需要在它崩溃之前做一些操作的话，可以在这里
        return Promise.reject(error)
    } else {
        return Promise.reject('请求超时, 请刷新重试')
    }
})
/* 统一封装get请求 */
export const GET = (url, params, config = {}) => {
    return new Promise((resolve, reject) => {
        instance({
            method: 'get',
            url,
            params,
            ...config
        }).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

/* 统一封装post请求  */
export const POST = (url, data, config = {}) => {
    return new Promise((resolve, reject) => {
        instance({
            method: 'post',
            url,
            data,
            ...config
        }).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}