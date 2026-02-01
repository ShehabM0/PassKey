import z from 'zod'

const emailSchema = z.object({ email: z.email().max(255).toLowerCase().trim() })

const passwordSchema = z.object({ 
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/\d/, "Must contain a number")
    .regex(/[@$!%*?&#]/, "Must contain a special character"),
})

export { emailSchema, passwordSchema }
