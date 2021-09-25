// import { Func } from "@typegoose/typegoose/lib/types"
// import Router from "koa-router"

// export const service: (target: any) => Router.IMiddleware<any, {}> = (target) => {
//     return target.routes()
// }

// let _innerRouter: Record<string, Router<any, {}>> = {}

// export let model: (prefix: string) => ClassDecorator = function(prefix) {
//     const router = new Router({
//         prefix: _get_prefix(prefix),
//     })
//     return function (target) {
//         _innerRouter[target.name] = router 
//     }
// }

// export let func: (method: 'GET' | 'POST', prefix: string) => MethodDecorator = function (method, prefix) {
//     return function(target, _, __) {
//         prefix = _get_prefix(prefix)
//         let router: Router = _innerRouter[(target as Function).name];
//         if (!router) {
//             console.error("没有router", (target as Function).name)
//         }
//         if (method === 'GET') {
//             router.get(prefix)
//         } else if (method === 'POST') {
//             router.post(prefix)
//         }
//     }
// }

// let _get_prefix = (prefix: string) => prefix.startsWith("/") ? prefix : prefix.slice(1);