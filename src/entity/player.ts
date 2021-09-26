import { getModelForClass, prop } from "@typegoose/typegoose";
import { redis } from "../redis/redis";
import * as uuid from "uuid"

export interface PlayerData {
    uid?: string
    nick?: string
    avatar?: string
}

class Players implements PlayerData {
    @prop({
        unique: true,
        type: String,
    })
    public uid?: string

    @prop({
        type: String,
    })
    public nick?: string

    @prop({
        type: String,
    })
    public avatar?: string

    @prop({
        type: Number
    })
    public createTime?: string

    @prop({
        type: Number,
    })
    public lastLoginTime?: number
}

export const PlayerModel = getModelForClass(Players, {
    schemaOptions: {
        versionKey: false
    }
})

/**
 * 获取玩家信息
 * redis -> mongo -> null
 * @param uid 
 * @returns 
 */
export const getPlayer = async (uid: string): Promise<PlayerData | null> => {
    if (uuid.validate(uid)) {
        // 是游客
        console.log('is')
        let res = await redis.get(`guest:info:${uid}`);
        if (!res) {
            let res = await PlayerModel.findOne({ uid });
            return res
        } else {
            let playerData = JSON.parse(res)
            return playerData
        }
    } else {
        // 不是游客
        console.log('not')
        throw new Error("todo")
    }
}

export const setGuestPlayer = async (data: PlayerData) => {
    await redis.set(`guest:info:${data.uid}`, JSON.stringify(data))
}
