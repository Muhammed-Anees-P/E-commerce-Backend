import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtStrategy } from 'src/auth/jwt_strategy';
import { SuperAdminModule } from 'src/super-admin/super-admin.module';
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
        forwardRef(() => UserModule),
        forwardRef(() => SuperAdminModule),
    ],
    providers:[jwtStrategy],
    exports:[PassportModule, JwtModule, jwtStrategy]
    
})
export class AuthModule {}
