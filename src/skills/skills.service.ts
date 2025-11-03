import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { AddSkillDto } from "./dto/add-skill.dto"
import { UpdateSkillDto } from "./dto/update-skill.dto"

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) { }

  async addSkill(candidateId: string, dto: AddSkillDto) {
    // Verify candidate exists
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: candidateId },
    })

    if (!candidate) {
      throw new NotFoundException("Candidate not found")
    }

    if (dto.proficiency < 0 || dto.proficiency > 10) {
      throw new BadRequestException("Proficiency must be between 0 and 10")
    }

    return this.prisma.skill.create({
      data: {
        candidateId,
        skillName: dto.skillName,
        proficiency: dto.proficiency,
        yearsUsed: dto.yearsUsed || 0,
      },
    })
  }

  async getSkills(candidateId: string) {
    const skills = await this.prisma.skill.findMany({
      where: { candidateId },
      orderBy: {
        proficiency: "desc",
      },
    })

    return skills
  }

  async updateSkill(skillId: string, dto: UpdateSkillDto) {
    const skill = await this.prisma.skill.findUnique({
      where: { id: skillId },
    })

    if (!skill) {
      throw new NotFoundException("Skill not found")
    }

    if (dto.proficiency && (dto.proficiency < 0 || dto.proficiency > 10)) {
      throw new BadRequestException("Proficiency must be between 0 and 10")
    }

    return this.prisma.skill.update({
      where: { id: skillId },
      data: {
        skillName: dto.skillName || skill.skillName,
        proficiency: dto.proficiency !== undefined ? dto.proficiency : skill.proficiency,
        yearsUsed: dto.yearsUsed !== undefined ? dto.yearsUsed : skill.yearsUsed,
      },
    })
  }

  async deleteSkill(skillId: string) {
    const skill = await this.prisma.skill.findUnique({
      where: { id: skillId },
    })

    if (!skill) {
      throw new NotFoundException("Skill not found")
    }

    return this.prisma.skill.delete({
      where: { id: skillId },
    })
  }
}
