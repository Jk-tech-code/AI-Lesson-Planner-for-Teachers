import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = "AI Lesson Planner <onboarding@resend.dev>"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export async function sendWelcomeEmail({
  name,
  email,
}: {
  name: string
  email: string
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to AI Lesson Planner!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <tr>
              <td style="text-align: center; padding-bottom: 32px;">
                <h1 style="margin: 0; font-size: 24px; color: #7C3AED;">AI Lesson Planner</h1>
              </td>
            </tr>
            <tr>
              <td style="background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h2 style="margin: 0 0 8px 0; font-size: 20px; color: #1a1a1a;">Welcome, ${name}! 👋</h2>
                <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.5; color: #6b7280;">
                  We're excited to have you on board. AI Lesson Planner helps you generate CBC-aligned teaching documents in seconds.
                </p>
                <table cellpadding="0" cellspacing="0" style="margin: 0 auto 32px auto;">
                  <tr>
                    <td style="background: #7C3AED; border-radius: 8px; text-align: center;">
                      <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 12px 32px; font-size: 16px; color: #ffffff; text-decoration: none; font-weight: 600;">
                        Go to Dashboard
                      </a>
                    </td>
                  </tr>
                </table>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom: 16px;">
                      <table width="100%" cellpadding="16" cellspacing="0" style="background: #f5f3ff; border-radius: 8px;">
                        <tr>
                          <td>
                            <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #7C3AED;">Quick Start Tips</p>
                            <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6; color: #4b5563;">
                              <li>Create your first lesson plan from the dashboard</li>
                              <li>Try the AI chat assistant for instant help</li>
                              <li>Explore exam and assessment generators</li>
                            </ul>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding-top: 24px;">
                <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                  AI Lesson Planner — Generate professional CBC teaching documents with AI
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })
  } catch (error) {
    console.error("Failed to send welcome email:", error)
  }
}

export async function sendPasswordResetEmail({
  email,
  token,
}: {
  email: string
  token: string
}) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset your AI Lesson Planner password",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <tr>
              <td style="text-align: center; padding-bottom: 32px;">
                <h1 style="margin: 0; font-size: 24px; color: #7C3AED;">AI Lesson Planner</h1>
              </td>
            </tr>
            <tr>
              <td style="background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h2 style="margin: 0 0 8px 0; font-size: 20px; color: #1a1a1a;">Reset Your Password</h2>
                <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.5; color: #6b7280;">
                  Someone requested a password reset for your account. If this was you, click the button below.
                  If you didn't request this, you can safely ignore this email.
                </p>
                <table cellpadding="0" cellspacing="0" style="margin: 0 auto 32px auto;">
                  <tr>
                    <td style="background: #7C3AED; border-radius: 8px; text-align: center;">
                      <a href="${resetUrl}" style="display: inline-block; padding: 12px 32px; font-size: 16px; color: #ffffff; text-decoration: none; font-weight: 600;">
                        Reset Password
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin: 0; font-size: 14px; color: #9ca3af;">
                  This link expires in 1 hour. If you need a new link, visit the forgot password page.
                </p>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding-top: 24px;">
                <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                  AI Lesson Planner — Generate professional CBC teaching documents with AI
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })
  } catch (error) {
    console.error("Failed to send password reset email:", error)
  }
}
