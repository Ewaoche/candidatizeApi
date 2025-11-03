import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) { }

  async getDashboardStats() {
    const [totalCandidates, assessedCandidates, averageTierScore, tierDistribution] = await Promise.all([
      this.prisma.candidate.count(),
      this.prisma.candidate.count({
        where: { status: "tier_assigned" },
      }),
      this.prisma.candidate.aggregate({
        _avg: { tierScore: true },
      }),
      this.prisma.candidate.groupBy({
        by: ["tier"],
        _count: { id: true },
      }),
    ])

    const tierNames = ["Entry Level", "Beginner", "Intermediate", "Advanced", "Expert", "Master"]

    return {
      totalCandidates,
      assessedCandidates,
      pendingAssessment: totalCandidates - assessedCandidates,
      assessmentRate: totalCandidates > 0 ? ((assessedCandidates / totalCandidates) * 100).toFixed(2) : 0,
      averageTierScore: (averageTierScore._avg.tierScore || 0).toFixed(2),
      tierDistribution: tierDistribution.map((item) => ({
        tier: item.tier,
        tierName: tierNames[item.tier],
        count: item._count.id,
        percentage: totalCandidates > 0 ? ((item._count.id / totalCandidates) * 100).toFixed(2) : 0,
      })),
    }
  }

  async getSkillAnalytics() {
    const skillStats = await this.prisma.skill.groupBy({
      by: ["skillName"],
      _avg: {
        proficiency: true,
      },
      _count: {
        id: true,
      },
      _max: {
        proficiency: true,
      },
    })

    return skillStats
      .map((skill) => ({
        skillName: skill.skillName,
        candidatesCount: skill._count.id,
        averageProficiency: (skill._avg.proficiency || 0).toFixed(2),
        maxProficiency: skill._max.proficiency,
      }))
      .sort((a, b) => b.candidatesCount - a.candidatesCount)
  }

  async getCandidatesByLocation() {
    const locationStats = await this.prisma.candidate.groupBy({
      by: ["location"],
      _count: { id: true },
    })

    return locationStats.filter((item) => item.location !== null).sort((a, b) => b._count.id - a._count.id)
  }

  async getExperienceAnalytics() {
    const experienceData = await this.prisma.candidate.findMany({
      select: { yearsOfExperience: true },
    })

    const buckets = {
      "0-1": 0,
      "1-3": 0,
      "3-5": 0,
      "5-10": 0,
      "10+": 0,
    }

    experienceData.forEach(({ yearsOfExperience }) => {
      if (yearsOfExperience < 1) buckets["0-1"]++
      else if (yearsOfExperience < 3) buckets["1-3"]++
      else if (yearsOfExperience < 5) buckets["3-5"]++
      else if (yearsOfExperience < 10) buckets["5-10"]++
      else buckets["10+"]++
    })

    return buckets
  }
}
