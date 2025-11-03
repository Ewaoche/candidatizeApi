import { IsEmail, IsString, MinLength, IsNotEmpty } from "class-validator"

export class RegisterAdminDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string

  @IsString()
  @IsNotEmpty()
  name: string
}
