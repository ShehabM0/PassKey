import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface EmailDAO {
  to: string;
  subject: string;
  htmlTempPath: string;
  variables?: Record<string, any>;
}

export { transporter, type EmailDAO }