import { IsString, IsNumber, Min, Max, IsOptional } from "class-validator"

export class UpdateSkillDto {
  @IsOptional()
  @IsString()
  skillName?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  proficiency?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  yearsUsed?: number
}
