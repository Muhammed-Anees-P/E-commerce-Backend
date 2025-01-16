import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";




@Schema({
    timestamps:true,
})

export class user extends Document {
    @Prop({required:true})
    name:string

    @Prop({required:true, unique:true})
    email:string

    @Prop({required: true, min:6})
    password:string

    @Prop({enum:['user','admin'], default:'user'})
    role:'user'| 'admin'

    @Prop({required:false, default:false})
    isBlocked:boolean
}

export const userSchema = SchemaFactory.createForClass(user)