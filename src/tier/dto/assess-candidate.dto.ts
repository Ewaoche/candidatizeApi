import { IsOptional, IsNumber, Min } from "class-validator"

export class AssessCandidateDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  yearsOfExperienceMultiplier?: number
}
