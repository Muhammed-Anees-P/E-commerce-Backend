import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { user } from './schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt"
import { loginDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(user.name)
    private userModel: Model<user>,
    private jwtService: JwtService
  ){}

 //user signup 
 async register(createUserDto:CreateUserDto ) : Promise <{message:string}>  {
  const {name, email ,  password, confirmPassword,role} = createUserDto

  //chech password and confirm password is match
  if(password !== confirmPassword){
    throw new UnauthorizedException("Password and confirm Password do not match")
  }

  //check  user exist
  const userExist = await this.userModel.findOne({email})
  if(userExist){
    throw new UnauthorizedException("Email already exist")
  }

  //salt round for hashed password
  const saltRounds = 10
  let hashedPassword = await bcrypt.hash(password, saltRounds)
  
  //create user
  const user = await this.userModel.create({
    name,
    email,
    password:hashedPassword,
    role
  })
  

  return {message: "User registered successfully"}

 }

 async login (loginDto:loginDto, res:any) : Promise<{message:string}> {

  const{email, password, role} = loginDto

  //check user is exist or not
  const userExist = await this.userModel.findOne({email})
  if(!userExist){
    throw new UnauthorizedException("Invalid email or password")
  }
  
  //chech password match
  const isMatchPassword = await bcrypt.compare(password,userExist.password)

  if(!isMatchPassword){
    throw new UnauthorizedException("Invalid email or password")
  }

  //validate role
  if(userExist.role !== role){
    throw new UnauthorizedException("Role does not match")
  }

  //check user status
  if(userExist.isBlocked){
    throw new UnauthorizedException('Your account has been blocked. Contact help to support')
  }

  //create token for user
  const token = this.jwtService.sign({id:userExist._id, email:userExist.email})

  //pass token through cookie
  res.cookie('authToken', token ,{
    httpOnly:true,
    maxAge: 24 * 60 * 60 * 1000
  })

  res.json({ message: 'User login successful' });

  return;
}


}
