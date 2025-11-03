import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { PrismaModule } from "./prisma/prisma.module"
import { AuthModule } from "./auth/auth.module"
import { CandidatesModule } from "./candidates/candidates.module"
import { SkillsModule } from "./skills/skills.module"
import { TierModule } from "./tier/tier.module"
import { AnalyticsModule } from "./analytics/analytics.module"
import { ExportModule } from "./export/export.module"
import { EmailModule } from "./email/email.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    PrismaModule,
    AuthModule,
    CandidatesModule,
    SkillsModule,
    TierModule,
    AnalyticsModule,
    ExportModule,
    EmailModule,
  ],
})
export class AppModule {}
