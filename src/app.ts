import Koa from 'koa'
import koaBody from 'koa-body'
import mongoose from 'mongoose'
import winston from 'winston'
import { config } from './config'
import { logger } from './logger'
import { userRouter } from './controller/user/user'

const app = new Koa()

mongoose.connect(config.dbConfig.databaseUrl, {
    dbName: config.dbConfig.dbName,
}).then(() => {
    
    // 日志
    app.use(logger(winston))

    // 解析请求体
    app.use(koaBody({
        text: false,
    }))

    // 路由注册
    app.use(userRouter.routes())

    app.listen(config.port)
})
