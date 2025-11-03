import { Injectable, BadRequestException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import * as XLSX from "xlsx"
import * as fs from "fs"
import * as path from "path"

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) { }

  async exportCandidatesToCSV(tier?: number, search?: string) {
    const candidates = await this.getCandidatesForExport(tier, search)

    if (candidates.length === 0) {
      throw new BadRequestException("No candidates found to export")
    }

    // Prepare CSV data
    const csvData = candidates.map((candidate) => ({
      "First Name": candidate.firstName,
      "Last Name": candidate.lastName,
      Email: candidate.email,
      Phone: candidate.phone || "-",
      Location: candidate.location || "-",
      "Years of Experience": candidate.yearsOfExperience,
      Tier: candidate.tier,
      "Tier Score": candidate.tierScore.toFixed(2),
      Status: candidate.status,
      "Skills Count": candidate.skills.length,
      "Created At": new Date(candidate.createdAt).toLocaleDateString(),
    }))

    // Convert to XLSX
    const worksheet = XLSX.utils.json_to_sheet(csvData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates")

    // Generate filename
    const filename = `candidates_${new Date().toISOString().split("T")[0]}.xlsx`
    const filepath = path.join(process.cwd(), "exports", filename)

    // Ensure exports directory exists
    if (!fs.existsSync(path.join(process.cwd(), "exports"))) {
      fs.mkdirSync(path.join(process.cwd(), "exports"), { recursive: true })
    }

    // Save file
    XLSX.writeFile(workbook, filepath)

    return {
      filename,
      path: filepath,
      recordsCount: candidates.length,
      message: "Export completed successfully",
    }
  }

  async exportCandidatesWithSkills(tier?: number, search?: string) {
    const candidates = await this.getCandidatesForExport(tier, search)

    if (candidates.length === 0) {
      throw new BadRequestException("No candidates found to export")
    }

    // Prepare workbook with multiple sheets
    const workbook = XLSX.utils.book_new()

    // Sheet 1: Candidates
    const candidatesData = candidates.map((candidate) => ({
      "First Name": candidate.firstName,
      "Last Name": candidate.lastName,
      Email: candidate.email,
      Phone: candidate.phone || "-",
      Location: candidate.location || "-",
      "Years of Experience": candidate.yearsOfExperience,
      Tier: candidate.tier,
      "Tier Score": candidate.tierScore.toFixed(2),
      Status: candidate.status,
    }))

    const candidatesSheet = XLSX.utils.json_to_sheet(candidatesData)
    XLSX.utils.book_append_sheet(workbook, candidatesSheet, "Candidates")

    // Sheet 2: Skills
    const allSkills: any[] = []
    candidates.forEach((candidate) => {
      candidate.skills.forEach((skill) => {
        allSkills.push({
          "Candidate Email": candidate.email,
          "Candidate Name": `${candidate.firstName} ${candidate.lastName}`,
          "Skill Name": skill.skillName,
          Proficiency: skill.proficiency,
          "Years Used": skill.yearsUsed,
        })
      })
    })

    const skillsSheet = XLSX.utils.json_to_sheet(allSkills)
    XLSX.utils.book_append_sheet(workbook, skillsSheet, "Skills")

    // Save file
    const filename = `candidates_detailed_${new Date().toISOString().split("T")[0]}.xlsx`
    const filepath = path.join(process.cwd(), "exports", filename)

    if (!fs.existsSync(path.join(process.cwd(), "exports"))) {
      fs.mkdirSync(path.join(process.cwd(), "exports"), { recursive: true })
    }

    XLSX.writeFile(workbook, filepath)

    return {
      filename,
      path: filepath,
      candidatesCount: candidates.length,
      skillsCount: allSkills.length,
      message: "Export completed successfully",
    }
  }

  private async getCandidatesForExport(tier?: number, search?: string) {
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

    return this.prisma.candidate.findMany({
      where,
      include: { skills: true },
      orderBy: { createdAt: "desc" },
    })
  }
}
