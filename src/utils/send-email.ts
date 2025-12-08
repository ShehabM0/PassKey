import { transporter, type EmailDAO } from '../config/smtp.ts'
import { logger } from '../config/logger.ts'
import handlebars from 'handlebars'
import * as path from 'path'
import * as fs from 'fs'

const getHtmlTemp = (emailData: EmailDAO) => {
  const __dirname = path.resolve()
  const filePath = path.join(__dirname, emailData.htmlTempPath)
  const source = fs.readFileSync(filePath, 'utf-8').toString()
  const template = handlebars.compile(source)
  const replacements = {
    redirect_url: emailData.variables?.redirect_url,
  }
  const htmlTemp = template(replacements)
  return htmlTemp
}

const sendEmail = async (emailData: EmailDAO) => {
  try {
    const htmlTemp = getHtmlTemp(emailData)
    const info = await transporter.sendMail({
      from: `"PassKey+" <${process.env.EMAIL_USER}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: htmlTemp
    })
    return info
  } catch (e) {
    logger.info("Couldn't send email!")
    throw e
  }
}

export { sendEmail }
