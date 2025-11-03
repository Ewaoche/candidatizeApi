import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { EmailService } from "../email/email.service"
import { CreateCandidateDto } from "./dto/create-candidate.dto"
import { UpdateCandidateDto } from "./dto/update-candidate.dto"
import { Candidate } from "@prisma/client"

@Injectable()
export class CandidatesService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) { }

  async register(dto: CreateCandidateDto): Promise<Candidate> {
    const existingCandidate = await this.prisma.candidate.findUnique({
      where: { email: dto.email },
    })

    if (existingCandidate) {
      throw new BadRequestException("Candidate with this email already exists")
    }

    const candidate = await this.prisma.candidate.create({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        location: dto.location,
        yearsOfExperience: dto.yearsOfExperience || 0,
        status: "registered",
      },
      include: {
        skills: true,
      },
    })

    // Send welcome email
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.emailService.sendWelcomeEmail(candidate.email, candidate.firstName)

    return candidate
  }

  async findAll(skip = 0, take = 10, search?: string, tier?: number) {
    const where: any = {}

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    if (tier !== undefined) {
      where.tier = tier
    }

    const [candidates, total] = await Promise.all([
      this.prisma.candidate.findMany({
        where,
        skip,
        take,
        include: {
          skills: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.candidate.count({ where }),
    ])

    return {
      data: candidates,
      total,
      skip,
      take,
    }
  }

  async findById(id: string) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id },
      include: {
        skills: true,
      },
    })

    if (!candidate) {
      throw new NotFoundException("Candidate not found")
    }

    return candidate
  }

  async update(id: string, dto: UpdateCandidateDto) {
    const candidate = await this.findById(id)

    return this.prisma.candidate.update({
      where: { id },
      data: {
        firstName: dto.firstName || candidate.firstName,
        lastName: dto.lastName || candidate.lastName,
        phone: dto.phone || candidate.phone,
        location: dto.location || candidate.location,
        yearsOfExperience: dto.yearsOfExperience !== undefined ? dto.yearsOfExperience : candidate.yearsOfExperience,
      },
      include: {
        skills: true,
      },
    })
  }

  async delete(id: string) {
    await this.findById(id)

    return this.prisma.candidate.delete({
      where: { id },
    })
  }
}
