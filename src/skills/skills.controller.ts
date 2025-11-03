import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards } from "@nestjs/common"
import { SkillsService } from "./skills.service"
import { AddSkillDto } from "./dto/add-skill.dto"
import { UpdateSkillDto } from "./dto/update-skill.dto"
import { JwtAuthGuard } from "../auth/guards/jwt.guard"

@Controller("candidates/:candidateId/skills")
export class SkillsController {
  constructor(private skillsService: SkillsService) { }

  @Post()
  async addSkill(@Param('candidateId') candidateId: string, @Body() dto: AddSkillDto) {
    return this.skillsService.addSkill(candidateId, dto)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getSkills(@Param('candidateId') candidateId: string) {
    return this.skillsService.getSkills(candidateId);
  }

  @Put(":skillId")
  @UseGuards(JwtAuthGuard)
  async updateSkill(@Param('skillId') skillId: string, @Body() dto: UpdateSkillDto) {
    return this.skillsService.updateSkill(skillId, dto)
  }

  @Delete(':skillId')
  @UseGuards(JwtAuthGuard)
  async deleteSkill(@Param('skillId') skillId: string) {
    return this.skillsService.deleteSkill(skillId);
  }
}
