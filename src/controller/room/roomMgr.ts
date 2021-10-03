import { Players } from "../../entity/player";
import { RoomData } from "./roomData";

class _RoomMgr {
    rooms: Record<string, RoomData> = {}

    create(owner: Players & { nick: string, uid: string }) {
        let room = new RoomData(owner)
        this.rooms[room.roomId] = room
    }
}

export const RoomMgr = new _RoomMgr()