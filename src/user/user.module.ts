import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports:[
   AuthModule,
    MongooseModule.forFeature([{name:'user', schema:userSchema}]),
    forwardRef(() => AuthModule)
  ],
  controllers: [UserController],
  providers: [UserService],
  exports:[MongooseModule]
})
export class UserModule {}
 