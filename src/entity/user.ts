import { getModelForClass, prop } from "@typegoose/typegoose";

class Users {
    @prop()
    public uid?: string
    @prop()
    public pwd?: string
    @prop()
    public openid?: string
    @prop()
    public email?: string
}

export const UserModel = getModelForClass(Users)
