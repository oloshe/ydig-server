import { Context, Next } from "koa";
import { getPlayerByToken, Players } from "../entity/player";

export interface AuthAppend {
    player: Players
}

export const auth = async (ctx: Context & AuthAppend, next: Next) => {
    let token = ctx.cookies.get('token')
    if (token) {
        let player = await getPlayerByToken(token)
        if (player) {
            ctx.player = player
            next()
        }
    }
}