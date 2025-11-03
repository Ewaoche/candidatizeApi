import { Module } from "@nestjs/common"
import { TierService } from "./tier.service"
import { TierController } from "./tier.controller"
import { PrismaModule } from "../prisma/prisma.module"
import { EmailModule } from "../email/email.module"

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [TierController],
  providers: [TierService],
  exports: [TierService],
})
export class TierModule {}
