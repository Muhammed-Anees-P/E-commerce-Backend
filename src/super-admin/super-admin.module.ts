import { forwardRef, Module } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminController } from './super-admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { adminSchema } from './schemas/admin.schema';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports:[
    MongooseModule.forFeature([{name:"admin", schema:adminSchema}]),
    forwardRef(() => AuthModule)
  ],
    
  controllers: [SuperAdminController],
  providers: [SuperAdminService],
  exports:[MongooseModule, SuperAdminService]
})
export class SuperAdminModule {}
