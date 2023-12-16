const cache = new Map()

export const GetCache = (key) => {
    return cache.get(key)
}

export const SetCache = (key,value) => {
    cache.set(key,value)
}