import { Injectable, Logger } from "@nestjs/common"
import * as nodemailer from "nodemailer"

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter
  private logger = new Logger("EmailService")

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || "smtp.gmail.com",
      port: Number.parseInt(process.env.MAIL_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    })
  }

  async sendWelcomeEmail(email: string, firstName: string) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || "noreply@desishub.com",
        to: email,
        subject: "Welcome to DesisHub Candidate Portal",
        html: `
          <h2>Welcome, ${firstName}!</h2>
          <p>Thank you for registering with DesisHub's Candidate Categorization Platform.</p>
          <p>We're excited to assess your skills and find the perfect fit for you.</p>
          <p>Please add your skills to your profile to get started with the assessment process.</p>
          <p>Best regards,<br>DesisHub Team</p>
        `,
      }

      await this.transporter.sendMail(mailOptions)
      this.logger.log(`Welcome email sent to ${email}`)
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error)
    }
  }

  async sendTierAssignmentEmail(email: string, firstName: string, tier: number, tierName: string) {
    try {
      const tierDescriptions = {
        0: "Entry Level - Basic knowledge with minimal experience",
        1: "Beginner - Limited practical experience",
        2: "Intermediate - Solid experience across multiple skills",
        3: "Advanced - Deep expertise with leadership capabilities",
        4: "Expert - Mastery in specialized domains",
        5: "Master - Exceptional expertise and thought leadership",
      }

      const mailOptions = {
        from: process.env.SMTP_FROM || "noreply@desishub.com",
        to: email,
        subject: `Your DesisHub Skill Assessment Results - ${tierName}`,
        html: `
          <h2>Your Skill Assessment Results</h2>
          <p>Hi ${firstName},</p>
          <p>We've completed the assessment of your skills. Based on your self-declared proficiency and experience, you have been categorized as:</p>
          <h3 style="color: #2c3e50;">${tierName} (Tier ${tier})</h3>
          <p>${tierDescriptions[tier]}</p>
          <p>This tier placement reflects your current skill level and will help us match you with suitable opportunities.</p>
          <p>You can update your profile anytime to reflect any new skills or experience you've gained.</p>
          <p>Best regards,<br>DesisHub Team</p>
        `,
      }

      await this.transporter.sendMail(mailOptions)
      this.logger.log(`Tier assignment email sent to ${email}`)
    } catch (error) {
      this.logger.error(`Failed to send tier assignment email to ${email}:`, error)
    }
  }

  async sendBulkEmail(emails: string[], subject: string, htmlContent: string) {
    try {
      for (const email of emails) {
        const mailOptions = {
          from: process.env.SMTP_FROM || "noreply@desishub.com",
          to: email,
          subject,
          html: htmlContent,
        }

        await this.transporter.sendMail(mailOptions)
      }
      this.logger.log(`Bulk email sent to ${emails.length} recipients`)
    } catch (error) {
      this.logger.error(`Failed to send bulk email:`, error)
    }
  }
}
