import { Module } from "@nestjs/common"
import { CandidatesService } from "./candidates.service"
import { CandidatesController } from "./candidates.controller"
import { PrismaModule } from "../prisma/prisma.module"
import { EmailModule } from "../email/email.module"

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [CandidatesController],
  providers: [CandidatesService],
})
export class CandidatesModule {}
