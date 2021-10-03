import * as _uuid from "uuid"
const validateCodeSet = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`

export const getValidateCode = (len = 4) => {
    let buf = ''
    for(let i = 0; i < len; i++) {
        let index = Math.floor(Math.random() * validateCodeSet.length)
        buf += validateCodeSet[index]
    }
    return buf
}

export const uuid = _uuid;