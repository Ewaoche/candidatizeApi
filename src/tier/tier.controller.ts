import { Controller, Post, Get, Body, UseGuards, Param } from "@nestjs/common"
import { TierService } from "./tier.service"
import { AssessCandidateDto } from "./dto/assess-candidate.dto"
import { JwtAuthGuard } from "../auth/guards/jwt.guard"

@Controller("tier")
export class TierController {
  constructor(private tierService: TierService) { }

  @Post("assess/:candidateId")
  async assessCandidate(@Param("candidateId") candidateId: string, @Body() dto: AssessCandidateDto) {
    return this.tierService.assessCandidate(candidateId, dto)
  }

  @Get("distribution")
  @UseGuards(JwtAuthGuard)
  async getTierDistribution() {
    return this.tierService.getTierDistribution()
  }

  @Get("stats")
  @UseGuards(JwtAuthGuard)
  async getTierStats() {
    return this.tierService.getTierStats()
  }
}
