import { Controller, Get, UseGuards } from "@nestjs/common"
import { AnalyticsService } from "./analytics.service"
import { JwtAuthGuard } from "../auth/guards/jwt.guard"

@Controller("analytics")
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) { }

  @Get("dashboard")
  async getDashboardStats() {
    return this.analyticsService.getDashboardStats()
  }

  @Get("skills")
  async getSkillAnalytics() {
    return this.analyticsService.getSkillAnalytics()
  }

  @Get("locations")
  async getCandidatesByLocation() {
    return this.analyticsService.getCandidatesByLocation()
  }

  @Get("experience")
  async getExperienceAnalytics() {
    return this.analyticsService.getExperienceAnalytics()
  }
}
