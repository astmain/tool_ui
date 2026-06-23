/**
 * 邮箱验证码发送工具
 *
 * 使用 QQ SMTP 发送验证码邮件，验证码由调用方生成（通常为 6 位随机数）。
 *
 * 安全: SMTP_USER / SMTP_PASS 必须通过环境变量配置，不存在任何硬编码默认值。
 */
import nodemailer from 'nodemailer'

const config = useRuntimeConfig()
const smtpUser = config.smtpUser ?? process.env.SMTP_USER
const smtpPass = config.smtpPass ?? process.env.SMTP_PASS

if (!smtpUser || !smtpPass) {
  throw new Error('[email] 环境变量 SMTP_USER / SMTP_PASS 未配置，请设置后再启动服务')
}

const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 587,
  secure: false,
  auth: { user: smtpUser, pass: smtpPass },
})

/**
 * 发送邮箱验证码
 * @param to 收件人邮箱
 * @param code 验证码（6 位数字）
 */
export async function sendEmailCode(to: string, code: string) {
  const res = await transporter.sendMail({
    from: `next1 <${smtpUser}>`,
    to,
    subject: 'next1 邮箱验证码',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>next1 邮箱验证码</h2>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
        <p style="color: #666;">验证码 5 分钟内有效，请勿泄露给他人。</p>
      </div>
    `,
  })
  return { success: true, messageId: res.messageId }
}

/** 生成 6 位随机数字验证码 */
export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
