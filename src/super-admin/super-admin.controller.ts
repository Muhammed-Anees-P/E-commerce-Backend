import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException, Res, Put, Req, Request, UseGuards } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuard } from '@nestjs/passport';



@Controller('super-admin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  //super admin login
  @Post('login')
  async loginSuperAdmin(@Body() body:{email:string, password:string}, @Res() res:any)  {
    const {email, password} = body

      return await this.superAdminService.loginSuperAdmin(email, password,res)

  }
  
  //super admin logout
  @Post('logout')
  async logoutSuperAdmin(@Res() res:any) :Promise <{message:string}> {
    return this.superAdminService.logoutSuperAdmin(res)
  }
  
  //super admin create admin's
  @Post('create-admin')
@UseGuards(AuthGuard())
  async createAdmin(@Body() createAdminDto: CreateAdminDto) : Promise<string> {
    return this.superAdminService.createAdmin(createAdminDto)
  }

  //super admin block admin
  @Put('block-admin/:id')
  @UseGuards(AuthGuard())
  async blockAdmin(@Param('id') id:string, @Res() res:any ) : Promise <{message:string}>{
    return this.superAdminService.blockAdmin(id,res)
  }

  //super admin unblock admin
  @Put('unblock-admin/:id')
  async unblockAdmin(@Param('id') id:string, @Res() res:any) : Promise <{message:string}> {
    return this.superAdminService.unblockAdmin(id,res)
  }

  //super admin delete admin
  @Delete('delete-admin/:id')
  async removeAdmin(@Param('id') id:string, @Res() res:any)  : Promise <{message:string}> {
    return this.superAdminService.removeAdmin(id,res)
  } 
   
}
