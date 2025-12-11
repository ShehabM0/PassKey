import type { Request, Response, CookieOptions } from 'express'

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000
}

const cookies = {
  set: (res: Response, name: string, value: string, options = {}) => {
    res.cookie(name, value, { ...cookieOptions, ...options });
  },

  clear: (res: Response, name: string, value: string, options = {}) => {
    res.clearCookie(name, { ...cookieOptions, ...options });
  },

  get: (req: Request, name: string) => {
    return req.cookies[name];
  },
}

export { cookies }