export const APIS = {
    // Auth
    HAS_REGISTER_API: "/api/auth/hasRegistered",
    REGISTER_API: "/api/auth/register",
    LOGIN_API: "/api/auth/login",

    // Chat
    CREATE_CHAT_API: "/api/chat/create/chatId",
    GET_CHATS_API: "/api/chat/get/chats",
    CHAT_API: "/api/chat",

    // User
    GET_USER_INFO: "/api/user/info",

    // Tool
    GET_PUBLIC_TOOLS: "/api/tool/get/public",
    PUSH_MSG_REDUCE_DUPLICATION: "/api/tool/reduce-duplication",
    PUSH_MSG_TRANSLATOR: "/api/tool/translator",
    PUSH_MSG_SUMMARY: "/api/tool/summary",
    PUSH_MSG_WRITE: "/api/tool/write",

    // Engine
    GET_SUPPORT_ENGINES: "/api/engine/get/support",
    CREATE_APIKEY: "/api/engine/create/apikey",
    UPDATE_APIKEY: "/api/engine/update/apikey",
    GET_APIKEY: "/api/engine/get/apikeys",
    DELETE_APIKEY: "/api/engine/delete/apikey",

    // Files
    UPLOAD_FILE: "/api/file/upload",
}