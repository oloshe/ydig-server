import Koa from 'koa'
import koaBody from 'koa-body'
import mongoose from 'mongoose'
import winston from 'winston'
import { config } from './config'
import { RoomController } from './controller/room/room'
import { UserController } from './controller/user/user'
import { mapRoutes, registerController } from './decorator/controller'
import { loggerMiddleWave } from './logger'
import { auth } from './middlewave/auth'

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
    registerController(
        UserController,
        RoomController,
    )
    let [routes, tokenRouters] = mapRoutes()
    routes.forEach(routers => app.use(routers))
    app.use(auth)
    tokenRouters.forEach(routers => app.use(routers))

    app.listen(config.port, () => {
		console.log('Started Successfully')
	})
})
