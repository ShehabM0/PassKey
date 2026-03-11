import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: Number(process.env.EMAIL_PORT),
  secure: true,
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