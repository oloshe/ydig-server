import { Context } from 'koa'
import * as uuid from "uuid";
import Router from 'koa-router'
import { PlayerData, PlayerModel } from '../../entity/player';
import { redis } from '../../redis/redis';
import { getValidateCode } from '../../utils/utils';

interface loginData {
    account: string
    pwd: string
}

interface RegisterData {
    email: string
    pwd: string
}

class UserController {
    /** 验证邮箱 */
    public static emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    public static async login(ctx: Context): Promise<void> {
        let reqBody = ctx.request.body as loginData
        let { account, pwd } = reqBody
        if (!account || !pwd) {
            ctx.body = "参数错误"
            return
        }
        if (UserController.emailRegExp.test(account)) {
            console.log('这是邮箱')
        } else {
            console.log('这是id')
        }
        console.log(account, pwd)
        ctx.body = "登陆成功2"
    }
    /**
     * 游客登陆
     */
    public static async guest_login(ctx: Context): Promise<void> {
        let id = uuid.v4() // 游客随机id
        let data: PlayerData = {
            uid: id,
            nick: "游客",
            avatar: ""
        }
        await PlayerModel.create({...data});
        let token = uuid.v4();
        redis.set(`guest:info:${id}`, JSON.stringify(data));
        redis.set(`token:${token}`, id, 'EX', 10);
        ctx.body = data
    }

    public static async register(ctx: Context): Promise<void> {
        let { email, pwd } = ctx.request.body as RegisterData;
        if (!email || !pwd) {
            return
        }
        if (!this.emailRegExp.test(email)) {
            console.log("邮箱错误")
            return
        }

        let code = getValidateCode(4)
    }
}

let router = new Router({ prefix: `/user` })
router.post(`/login`, UserController.login)
router.get(`/guest`, UserController.guest_login)
router.post(`/reg`, UserController.register)
export const userRouter = router