import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { loginDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  //user signup function
  @Post('signup')
  register(@Body() CreateUserDto:CreateUserDto) : Promise<{message:string}> {
    return this.userService.register(CreateUserDto)
  }

  //user login
  @Get('signin')
 login(@Body() loginDto:loginDto , @Res() res:Response) : Promise <{message:string}> {
  return this.userService.login(loginDto,res)
 }
 
  
}
