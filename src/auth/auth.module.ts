import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtStrategy } from 'src/user/jwt_strategy';
import { UserModule } from 'src/user/user.module';

@Module({
    imports:[
        PassportModule.register({defaultStrategy:'jwt'}),
        JwtModule.registerAsync({
            inject:[ConfigService],
            useFactory: (config : ConfigService) =>({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: config.get<string | number>('JWT_EXPIRES_IN'),
                }
            }),
        }),
        forwardRef(() => UserModule)
    ],
    providers:[jwtStrategy],
    exports:[PassportModule, JwtModule, jwtStrategy]
    
})
export class AuthModule {}
