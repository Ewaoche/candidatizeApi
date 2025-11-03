import { IsEmail, IsString, IsOptional, IsNumber, Min } from "class-validator"

export class CreateCandidateDto {
  @IsEmail()
  email: string

  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  location?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  yearsOfExperience?: number
}
