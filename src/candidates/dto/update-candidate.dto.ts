import { IsString, IsOptional, IsNumber, Min } from "class-validator"

export class UpdateCandidateDto {
  @IsOptional()
  @IsString()
  firstName?: string

  @IsOptional()
  @IsString()
  lastName?: string

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
