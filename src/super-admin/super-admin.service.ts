import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as dotenv from 'dotenv'
import * as bcrypt from 'bcrypt'
import { admin, adminSchema } from './schemas/admin.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';


dotenv.config()

@Injectable()
export class SuperAdminService {
    private readonly superAdminEmail = process.env.SUPER_ADMIN_EMAIL
    private readonly superAdminPassword =process.env.SUPER_ADMIN_PASSWORD

    constructor(
        @InjectModel(admin.name) private readonly adminModel: Model<admin>,
        private jwtService: JwtService
    ){}


    //validate super admin credentials
    async validateSuperAdmin(email:string, password:string) : Promise <boolean> {
        if(email !== this.superAdminEmail || password !== this.superAdminPassword){
            return false
        }
        return true
    }


    //super admin login
    async loginSuperAdmin(email:string, password:string, res:any) : Promise<{message:string}> {

        //validate super admin email
        if(email !== this.superAdminEmail){
            throw new UnauthorizedException("Invalid credentials")
        }

        //validate super admin password
        if(password !== this.superAdminPassword){
            throw new UnauthorizedException('Invalid credentials')
        }

        //generate token for super admin
        const token = this.jwtService.sign({
            email:this.superAdminEmail,
            role:'super-admin'
        })

        //set token in cookie
        res.cookie('authToken', token, {
            httpOnly:true,
            maxAge: 24 * 60 * 60 * 1000
        })

        //send response
        res.json({message:'Super Admin login successfull'})
        return ;

    }


    //super admin logout
    async logoutSuperAdmin(res:any) : Promise<{message:string}> {

        //clear authentication token in cookie
        res.clearCookie('authToken', {
            httpOnly: true,
        });

        //send response
        res.json({message: 'Super Admin logout successfull'})
        return ;
    }


    //super admin  create admins
    async createAdmin(createAdmin:CreateAdminDto) : Promise<string> {
        //fetch data's in DTO
        const{email, password} = createAdmin

        //hash admin password before saving
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password,saltRounds)

        const newAdmin =new this.adminModel({
            email,
            password:hashedPassword,
        }) 

        await newAdmin.save()

        //send response
        return `Admin ${email} created successfully`


    }

    async blockAdmin(id:string , res:any) : Promise<{message:string}>{

        //find admin by id
        const adminBlock = await this.adminModel.findById(id)
        if(!adminBlock){
            throw new UnauthorizedException('Admin not found')
        }

        //check if the admin is already blocked
        if(adminBlock.isBlocked){
            throw new UnauthorizedException('Admin is already blocked')
        }

        //block admin
        adminBlock.isBlocked = true

        //save the updated admin
        await adminBlock.save()

        //send response
        res.json({message:`admin blocked successfully`})
        return;
    }

    //unblock admin
    async unblockAdmin(id:string, res:any) : Promise<{message:string}> {

        //find admin by id
        const adminUnblock = await this.adminModel.findById(id)
 
        //validate admin
        if(!adminUnblock){
            throw new UnauthorizedException('Admin not found...!!')
        }
 
        //validate admin status
        if(!adminUnblock.isBlocked){
            throw new UnauthorizedException('Admin is already Unblocked')
        }

        //unblock admin
        adminUnblock.isBlocked = false

        //save updated admin
        await adminUnblock.save()

        //send response
        res.json({message:"Admin ublocked successfully"})
        return;

    }

    async removeAdmin(id:string, res:any) :Promise<{message:string}>{
        
        //find admin by id
        const removeAdmin = await this.adminModel.findById(id)

        //validate admin
        if(!removeAdmin){
            throw new UnauthorizedException('Admin not found or already deleted')
        }

        //remove admin
        await this.adminModel.findByIdAndDelete(id)

        //send response
        res.json({message:"Admin deleted successfully"})
        return;

    }

  
}
