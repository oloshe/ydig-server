import { Context } from "koa";
import { func, model } from "../../decorator/controller";
import { getPlayerByToken } from "../../entity/player";
import { AuthAppend } from "../../middlewave/auth";
import { RoomMgr } from "./roomMgr";

interface CreateRoomInfo {

}

@model('/room')
export class RoomController {

    @func.post('/create')
    public static async create(ctx: Context & AuthAppend) {
        RoomMgr.create(ctx.player.uid!);
        ctx.body = "1"
    }
}