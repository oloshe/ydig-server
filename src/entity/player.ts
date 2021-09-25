import { getModelForClass, prop } from "@typegoose/typegoose";

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
}

export const PlayerModel = getModelForClass(Players)
