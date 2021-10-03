import { getModelForClass, prop } from "@typegoose/typegoose";
import { redis } from "../redis/redis";
import { uuid } from "../utils/utils";

export class Players {
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

	@prop({
		type: String
	})
    public pwd?: string

    @prop({
		type: String
	})
    public openid?: string

    @prop({
		type: String
	})
    public email?: string
}

export const PlayerModel = getModelForClass(Players, {
    schemaOptions: {
        versionKey: false
    }
})


export const getPlayerByToken = async (token: string): Promise<Players|null> => {
    let uid = await getUidByToken(token)
    if (!uid) {
        return null
    }
    let player = await getPlayerByUid(uid);
    return player
}

/**
 * 获取玩家信息
 * redis -> mongo -> null
 * @param uid 
 * @returns 
 */
export const getPlayerByUid = async (uid: string): Promise<Players | null> => {
    if (uuid.validate(uid)) {
        // 是游客
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


export const getUidByToken = async (token: string): Promise<string|null> => {
	let ret = await redis.get(`token:${token}`)
	return ret
}

export const setGuestPlayer = async (data: Players, token: string) => {
	let uid = data.uid!
    await redis.set(`guest:info:${uid}`, JSON.stringify(data))
	await redis.set(`token:${token}`, uid)
}
