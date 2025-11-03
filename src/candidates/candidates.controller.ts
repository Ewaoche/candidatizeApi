import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from "@nestjs/common"
import { CandidatesService } from "./candidates.service"
import { CreateCandidateDto } from "./dto/create-candidate.dto"
import { UpdateCandidateDto } from "./dto/update-candidate.dto"
import { JwtAuthGuard } from "../auth/guards/jwt.guard"

@Controller("candidates")
export class CandidatesController {
  constructor(private candidatesService: CandidatesService) { }

  @Post('register')
  async register(@Body() dto: CreateCandidateDto) {
    return this.candidatesService.register(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    @Query('tier') tier?: string,
  ) {
    return this.candidatesService.findAll(
      Number.parseInt(skip || "0"),
      Number.parseInt(take || "10"),
      search,
      tier ? Number.parseInt(tier) : undefined,
    )
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return this.candidatesService.findById(id);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateCandidateDto) {
    return this.candidatesService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return this.candidatesService.delete(id);
  }
}
