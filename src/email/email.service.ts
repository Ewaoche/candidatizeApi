import { Injectable, Logger } from "@nestjs/common"
import { Resend } from "resend"

@Injectable()
export class EmailService {
  private resend: Resend
  private logger = new Logger("EmailService")
  private fromEmail: string

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY)
    this.fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"
  }

  async sendWelcomeEmail(email: string, firstName: string) {
    try {
      const response = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: "Welcome to DesisHub Candidate Portal",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Welcome, ${firstName}!</h2>
            <p>Thank you for registering with DesisHub's Candidate Categorization Platform.</p>
            <p>We're excited to assess your skills and find the perfect fit for you.</p>
            <p>Please add your skills to your profile to get started with the assessment process.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #7f8c8d; font-size: 12px;">Best regards,<br>DesisHub Team</p>
          </div>
        `,
      })

      if (response.error) {
        this.logger.error(`Failed to send welcome email to ${email}:`, response.error)
      } else {
        this.logger.log(`Welcome email sent to ${email} (ID: ${response.data?.id})`)
      }
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

      const response = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: `Your DesisHub Skill Assessment Results - ${tierName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Your Skill Assessment Results</h2>
            <p>Hi ${firstName},</p>
            <p>We've completed the assessment of your skills. Based on your self-declared proficiency and experience, you have been categorized as:</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #3498db; margin: 0;">${tierName} (Tier ${tier})</h3>
              <p style="margin: 10px 0; color: #555;">${tierDescriptions[tier]}</p>
            </div>
            <p>This tier placement reflects your current skill level and will help us match you with suitable opportunities.</p>
            <p>You can update your profile anytime to reflect any new skills or experience you've gained.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #7f8c8d; font-size: 12px;">Best regards,<br>DesisHub Team</p>
          </div>
        `,
      })

      if (response.error) {
        this.logger.error(`Failed to send tier assignment email to ${email}:`, response.error)
      } else {
        this.logger.log(`Tier assignment email sent to ${email} (ID: ${response.data?.id})`)
      }
    } catch (error) {
      this.logger.error(`Failed to send tier assignment email to ${email}:`, error)
    }
  }

  async sendBulkEmail(emails: string[], subject: string, htmlContent: string) {
    try {
      const emailPromises = emails.map((email) =>
        this.resend.emails.send({
          from: this.fromEmail,
          to: email,
          subject,
          html: htmlContent,
        }),
      )

      const results = await Promise.all(emailPromises)
      const successCount = results.filter((r) => !r.error).length

      this.logger.log(`Bulk email sent to ${successCount}/${emails.length} recipients`)

      // Log any failures
      results.forEach((result, index) => {
        if (result.error) {
          this.logger.error(`Failed to send email to ${emails[index]}:`, result.error)
        }
      })
    } catch (error) {
      this.logger.error(`Failed to send bulk email:`, error)
    }
  }
}
