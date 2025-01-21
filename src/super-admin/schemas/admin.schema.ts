import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
    timestamps:true
})

export class admin extends Document{
    @Prop({required:true, unique:true})
    email:string

    @Prop({required:true})
    password:string

    @Prop({default:"admin"})
    role:string

    @Prop({default:true})
    isActive:boolean

    @Prop({default:false})
    isBlocked:boolean
}

export const adminSchema = SchemaFactory.createForClass(admin)