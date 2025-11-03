import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { PrismaService } from "../prisma/prisma.service"
import * as bcrypt from "bcryptjs"
import { RegisterAdminDto } from "./dto/register-admin.dto"
import { LoginAdminDto } from "./dto/login-admin.dto"

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async registerAdmin(dto: RegisterAdminDto) {
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    })

    if (existingAdmin) {
      throw new ConflictException("Admin with this email already exists")
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10)

    const admin = await this.prisma.admin.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    return {
      message: "Admin registered successfully",
      admin,
    }
  }

  async login(dto: LoginAdminDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    })

    if (!admin) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const isPasswordValid = await bcrypt.compare(dto.password, admin.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const token = this.jwtService.sign({
      sub: admin.id,
      email: admin.email,
    })

    return {
      access_token: token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    }
  }

  async validateAdmin(id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    if (!admin) {
      throw new UnauthorizedException("Admin not found")
    }

    return admin
  }
}
