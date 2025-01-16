import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";


//role enum
export enum Role{
    USER = 'user',
    ADMIN = 'admin'
}


export class loginDto {
    @IsNotEmpty({message:"Email is required"})
    @IsEmail({}, {message:"Please enter a valid email"})
    email:string

    @IsNotEmpty({message:"Password is required"})
    @IsString()
    @MinLength(6,{message:"Password must be at least 6 characters long"})
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,{
            message:"Password must be at least 6 characters long, contain a letter, a number , and a special character"
        })
    password:string



    @IsEnum(Role, {message:"Role must be either 'user' or 'admin' "})
    role:Role
}