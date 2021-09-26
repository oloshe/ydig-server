import Koa from 'koa'
import koaBody from 'koa-body'
import mongoose from 'mongoose'
import winston from 'winston'
import { config } from './config'
import { UserController } from './controller/user/user'
import { mapRoutes, registerController } from './decorator/controller'
import { loggerMiddleWave } from './logger'

const app = new Koa()

mongoose.connect(config.dbConfig.databaseUrl, {
    dbName: config.dbConfig.dbName,
}).then(() => {
    
    // 日志
    app.use(loggerMiddleWave(winston))

    // 解析请求体
    app.use(koaBody({
        text: false,
    }))

    // 路由注册
    registerController(UserController)
    mapRoutes().forEach(routers => app.use(routers))

    app.listen(config.port)
})
