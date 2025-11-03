import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { EmailService } from "../email/email.service"
import { AssessCandidateDto } from "./dto/assess-candidate.dto"

@Injectable()
export class TierService {
  // Define tier thresholds (0-100 scale)
  private readonly TIER_THRESHOLDS = {
    0: { min: 0, max: 20, name: "Entry Level", description: "Basic knowledge with minimal experience" },
    1: { min: 20, max: 35, name: "Beginner", description: "Limited practical experience" },
    2: { min: 35, max: 55, name: "Intermediate", description: "Solid experience across multiple skills" },
    3: { min: 55, max: 70, name: "Advanced", description: "Deep expertise with leadership capabilities" },
    4: { min: 70, max: 85, name: "Expert", description: "Mastery in specialized domains" },
    5: { min: 85, max: 100, name: "Master", description: "Exceptional expertise and thought leadership" },
  }

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) { }

  async assessCandidate(candidateId: string, dto: AssessCandidateDto) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: candidateId },
      include: { skills: true },
    })

    if (!candidate) {
      throw new NotFoundException("Candidate not found")
    }

    // Calculate tier score based on skills
    const tierScore = this.calculateTierScore(candidate.skills, dto.yearsOfExperienceMultiplier)

    // Determine tier based on score
    const tier = this.determineTier(tierScore)

    // Update candidate with tier and assessment
    const updatedCandidate = await this.prisma.candidate.update({
      where: { id: candidateId },
      data: {
        tier,
        tierScore,
        status: "tier_assigned",
      },
      include: { skills: true },
    })

    // Send tier notification email
    if (!candidate.notificationSent) {
      await this.emailService.sendTierAssignmentEmail(
        candidate.email,
        candidate.firstName,
        tier,
        this.TIER_THRESHOLDS[tier].name,
      )

      // Mark notification as sent
      await this.prisma.candidate.update({
        where: { id: candidateId },
        data: { notificationSent: true },
      })
    }

    return {
      candidate: updatedCandidate,
      tier,
      tierName: this.TIER_THRESHOLDS[tier].name,
      tierScore,
      tierDescription: this.TIER_THRESHOLDS[tier].description,
    }
  }

  private calculateTierScore(skills: any[], yearsMultiplier = 1.2): number {
    if (skills.length === 0) return 0

    // Calculate average proficiency
    const avgProficiency = skills.reduce((sum, skill) => sum + skill.proficiency, 0) / skills.length

    // Calculate experience factor (0-20 points)
    const avgYearsUsed = skills.reduce((sum, skill) => sum + skill.yearsUsed, 0) / skills.length
    const experienceFactor = Math.min(avgYearsUsed * yearsMultiplier, 20)

    // Combined score (0-100 scale)
    const score = avgProficiency * 10 + experienceFactor
    return Math.min(score, 100)
  }

  private determineTier(score: number): number {
    for (let tier = 5; tier >= 0; tier--) {
      const threshold = this.TIER_THRESHOLDS[tier]
      if (score >= threshold.min) {
        return tier
      }
    }
    return 0
  }

  async getTierDistribution() {
    const distribution = await this.prisma.candidate.groupBy({
      by: ["tier"],
      _count: {
        id: true,
      },
    })

    return distribution.map((item) => ({
      tier: item.tier,
      tierName: this.TIER_THRESHOLDS[item.tier].name,
      count: item._count.id,
    }))
  }

  async getTierStats() {
    const stats = await this.prisma.candidate.aggregate({
      _avg: {
        tierScore: true,
      },
      _min: {
        tierScore: true,
      },
      _max: {
        tierScore: true,
      },
      _count: {
        id: true,
      },
    })

    return stats
  }
}
