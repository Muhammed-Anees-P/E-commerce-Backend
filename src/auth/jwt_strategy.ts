import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy, ExtractJwt} from 'passport-jwt'
import { user } from "../user/schemas/user.schema";
import { Model } from "mongoose";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectModel(user.name) private userModel : Model<user>,
        private readonly ConfigService: ConfigService



    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:ConfigService.get<string>('JWT_SECRET')
        })
    }
    async validate(payload:any){
        const {id, role, email} =  payload;
        //super admin validation
        if(role === 'super-admin') {
            const superAdminEmail = this.ConfigService.get<string>('SUPER_ADMIN_EMAIL')

            if(email !== superAdminEmail){
                throw new UnauthorizedException("Invalid super admin credentials")
            }
            return {userId:id, email:superAdminEmail, role:'super-admin'}
        }

        //user validation
        const user = await this.userModel.findById(id)
        if(!user) {
            throw new UnauthorizedException('Please login first')
        }
        return {userId:user.id, email:user.email, role:user.role}
    }
}

