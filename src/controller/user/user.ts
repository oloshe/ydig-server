import { Context } from 'koa'
import * as uuid from "uuid";
import Router from 'koa-router'
import { getPlayer, getUidFromToken, PlayerModel, setGuestPlayer } from '../../entity/player';
import { redis } from '../../redis/redis';
import { getValidateCode } from '../../utils/utils';
import { func, mapRoutes, model, registerController } from '../../decorator/controller';
import { logger } from '../../logger';

interface loginData {
    account: string
    pwd: string
}

interface RegisterData {
    email: string
    pwd: string
}

@model("/user")
export class UserController {
    /** 验证邮箱 */
    // public static emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    // @func.post("/login")
    // public static async login(ctx: Context): Promise<void> {
    //     // let reqBody = ctx.request.body as loginData
    //     // let { account, pwd } = reqBody
    //     // if (!account || !pwd) {
    //     //     ctx.body = "参数错误"
    //     //     return
    //     // }
    //     // if (UserController.emailRegExp.test(account)) {
    //     //     console.log('这是邮箱')
    //     // } else {
    //     //     console.log('这是id')
    //     // }
    //     // console.log(account, pwd)
    //     ctx.body = "暂不开放账号登陆，请选择游客登陆"
    // }
    /**
     * 游客登陆
     */
    @func.get("/guest")
    @func.get("/guest/:token")
    public static async guest_login(ctx: Context): Promise<void> {
        let token = ctx.params.token
        // 携带id为非第一次登陆，从数据拿数据，如果拿不到则创建
        if (token) {
			let uid = await getUidFromToken(token)
			if (!uid) {
				// token 无效，重新登录
				ctx.body = {
					error: 1
				}
				return
			}
            let player = await getPlayer(uid)
            if (player !== null) {
                // 更新上次登陆时间
                await PlayerModel.updateOne({ uid }, {
                    lastLoginTime: Date.now()
                })
				ctx.cookies.set('token', token, { expires: new Date(Date.now() + 86400000)})
                ctx.body = {
                    playerData: {
                        ...player,
                        lastLoginTime: Date.now(),
                    }
                }
                return
            }
        }
        // 没有id，新建id
        let uid = uuid.v4() // 游客随机id
        let data = {
            uid: uid,
            nick: "游客",
            avatar: ""
        }
        let ret = await PlayerModel.create({...data, createTime: Date.now() })
		token = `${uid}-${Date.now()}`
        setGuestPlayer(ret, token)

		// 一天后过期
		ctx.cookies.set('token', token, { expires: new Date(Date.now() + 86400000)})

        ctx.body = {
            playerData: ret,
			token,
        }
    }

    // @func.post("/reg")
    // public static async register(ctx: Context): Promise<void> {
    //     // let { email, pwd } = ctx.request.body as RegisterData;
    //     // if (!email || !pwd) {
    //     //     return
    //     // }
    //     // if (!this.emailRegExp.test(email)) {
    //     //     console.log("邮箱错误")
    //     //     return
    //     // }

    //     // let code = getValidateCode(4)

    //     ctx.body = "暂不开放注册，请期待微信小程序"
    // }
}