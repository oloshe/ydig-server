import Router from "koa-router"

interface ModelsMetaData {
    prefix?: string,
    needToken?: boolean,
    get?: Record<string, Router.IMiddleware<any, {}> | undefined>,
    post?: Record<string, Router.IMiddleware<any, {}> | undefined>
}

interface DecoratorInner {
    models: Record<string, ModelsMetaData>,
    controllers: Array<Function>
}

let _inner: DecoratorInner = {
    models: {},
    controllers: []
}

export let registerController = (...target: Function[]) => {
    _inner.controllers.push(...target)
}

export let mapRoutes = () => {
    // console.log(_inner.models)
    let { models } = _inner
    let routers = [], tokenRouters = []
    for(const id in models) {
        let { prefix, needToken, get = {}, post = {}} = models[id];
        let router = new Router({ prefix: prefix })
        for (const path in get) { 
            get[path] && router.get(path, get[path]!) 
        }
        for (const path in post) {
            post[path] && router.post(path, post[path]!) 
        }
        let routes = router.routes()
        if (needToken) {
            tokenRouters.push(routes)
        } else {
            routers.push(routes)
        }
    }
    return [routers, tokenRouters]
}

/**
 * 
 * @param prefix 
 * @param needToken 是否需要token，默认为true
 * @returns 
 */
export let model = (prefix: string, needToken: boolean = true): ClassDecorator => {
    return target => {
        exploitObj(target.name, _inner.models)
        Object.assign(_inner.models[target.name], {
            prefix,
            needToken,
        })
    }
}

export let func = {
    get: funcGen('get'),
    post: funcGen('post'),
}

function funcGen (method: 'get' | 'post') {
    return (path: string): MethodDecorator => {
        return (target: any, _, descriptor) => {
            let name: string = target.name
            exploitObj(name, _inner.models)
            exploitObj(method, _inner.models[name])
            let map = _inner.models[name][method]!;
            (map as any)[path] = descriptor.value;
        }
    }
}

const exploitObj = (name: string, target: any) => {
    if (!target[name]) {
        target[name] = {}
    }
}