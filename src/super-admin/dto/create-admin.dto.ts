import { Equals, IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";


export class CreateAdminDto {
    @IsNotEmpty({message:"Email is required"})
    @IsEmail({},{message:"Please enter a valid email id"})
    email:string

    @IsNotEmpty({message:'Password id required'})
    @IsString()
    @MinLength(6,{message:"Password must be at least 6 characters long"})
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,{
            message:"Password must be at least 6 characters long, contain a letter, a number , and a special character"
        })
    password:string

    @IsNotEmpty({message:'role is required'})
    @Equals('admin',{message:"role must be admin"})
    role:string
}

