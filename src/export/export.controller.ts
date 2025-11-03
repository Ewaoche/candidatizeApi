import { Controller, Get, Res, UseGuards } from "@nestjs/common"
import { Response } from "express"
import { ExportService } from "./export.service"
import { JwtAuthGuard } from "../auth/guards/jwt.guard"
import * as fs from "fs"

@Controller("export")
@UseGuards(JwtAuthGuard)
export class ExportController {
  constructor(private exportService: ExportService) { }

  @Get("csv")
  async exportCSV(tier?: string, search?: string, @Res() res?: any) {
    const result = await this.exportService.exportCandidatesToCSV(tier ? Number.parseInt(tier) : undefined, search)

    if (res) {
      res.download(result.path, result.filename, (err) => {
        if (err) console.error(err)
        fs.unlink(result.path, (unlinkErr) => {
          if (unlinkErr) console.error(unlinkErr)
        })
      })
    }

    return result
  }

  @Get("excel")
  async exportExcel(tier?: string, search?: string, @Res() res?: any) {
    const result = await this.exportService.exportCandidatesWithSkills(tier ? Number.parseInt(tier) : undefined, search)

    if (res) {
      res.download(result.path, result.filename, (err) => {
        if (err) console.error(err)
        fs.unlink(result.path, (unlinkErr) => {
          if (unlinkErr) console.error(unlinkErr)
        })
      })
    }

    return result
  }
}
