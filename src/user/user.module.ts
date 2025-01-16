import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './schemas/user.schema';
import { jwtStrategy } from './jwt_strategy';


@Module({
  imports:[
    PassportModule.register({defaultStrategy:"jwt"}),
    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory:(config : ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions:{
            expiresIn:config.get<string | number>('JWT_EXPIRES_IN')
          }
        }
      }
    }),
    MongooseModule.forFeature([{name:'user', schema:userSchema}])
  ],
  controllers: [UserController],
  providers: [UserService, jwtStrategy],
  exports:[PassportModule, jwtStrategy]
})
export class UserModule {}
