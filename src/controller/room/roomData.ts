import { Players } from "../../entity/player"
import { uuid } from "../../utils/utils"

export class RoomData {
    public roomId: string
    public desc: string
    public max: number
    public count: number
    public ownerNick: string
    
    public ownerUid: string


    constructor(owner: Players & { nick: string, uid: string }) {
        this.roomId = uuid.v4()
        this.desc = "一个普通房间"
        this.count = 0
        this.max = 10
        this.ownerNick = owner.nick
        this.ownerUid = owner.uid
    }
}

export enum GameMode {
    Ydig = 1,
}