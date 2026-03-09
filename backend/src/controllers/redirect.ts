import { type Request, type Response } from 'express'

const updatePasswordPage = async(req: Request, res: Response) => {
  const { token } = req.params
  if(!token)
    return res.status(404).json({ message: "Token is required!" })
  const appUrl = `passkey://password-update?token=${token}`
  return res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Redirecting...</title>
        <meta charset="utf-8" />
      </head>
      <body>
        <p>Opening app...</p>

        <script>
          window.location.href = "${appUrl}";
        </script>

        <p>If the app didn't open, <a href="${appUrl}">tap here</a>.</p>
      </body>
    </html>
  `);
}

const verifyEmailPage = async(req: Request, res: Response) => {
  const { token } = req.params
  if(!token)
    return res.status(404).json({ message: "Token is required!" })
  const appUrl = `passkey://settings?token=${token}`
  return res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Redirecting...</title>
        <meta charset="utf-8" />
      </head>
      <body>
        <p>Opening app...</p>

        <script>
          window.location.href = "${appUrl}";
        </script>

        <p>If the app didn't open, <a href="${appUrl}">tap here</a>.</p>
      </body>
    </html>
  `);
}

const passwordResetPage = async(req: Request, res: Response) => {
  const { token } = req.params
  if(!token)
    return res.status(404).json({ message: "Token is required!" })
  const appUrl = `passkey://password-reset?token=${token}`
  return res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Redirecting...</title>
        <meta charset="utf-8" />
      </head>
      <body>
        <p>Opening app...</p>

        <script>
          window.location.href = "${appUrl}";
        </script>

        <p>If the app didn't open, <a href="${appUrl}">tap here</a>.</p>
      </body>
    </html>
  `);
}

export {
  updatePasswordPage,
  passwordResetPage,
  verifyEmailPage,
}
