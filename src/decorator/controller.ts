import { Func } from "@typegoose/typegoose/lib/types"
import Router from "koa-router"

interface ModelsMetaData {
    prefix?: string,
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
    let routers = []
    for(const id in models) {
        let { prefix, get = {}, post = {}} = models[id];
        let router = new Router({ prefix: prefix })
        for (const path in get) { 
            get[path] && router.get(path, get[path]!) 
        }
        for (const path in post) {
            post[path] && router.post(path, post[path]!) 
        }
        routers.push(router.routes())
    }
    return routers
}

export let model = (prefix: string): ClassDecorator => {
    return target => {
        exploitObj(target.name, _inner.models)
        _inner.models[target.name].prefix = prefix
    }
}

export let func = {
    get: funcGen('get'),
    post: funcGen('post'),
}

function funcGen (method: keyof Omit<ModelsMetaData, 'prefix'>) {
    return (path: string): MethodDecorator => {
        return (target: any, _, descriptor) => {
            let name: string = target.name
            exploitObj(name, _inner.models)
            exploitObj(method, _inner.models[name])
            let map = _inner.models[name][method]!;
            map[path] = descriptor.value as any;
        }
    }
}

const exploitObj = (name: string, target: any) => {
    if (!target[name]) {
        target[name] = {}
    }
}