import { Controller, Post, Body } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { RegisterAdminDto } from "./dto/register-admin.dto"
import { LoginAdminDto } from "./dto/login-admin.dto"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post("register")
  async register(@Body() dto: RegisterAdminDto) {
    return this.authService.registerAdmin(dto)
  }

  @Post("login")
  async login(@Body() dto: LoginAdminDto) {
    return this.authService.login(dto)
  }
}
