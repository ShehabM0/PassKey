import z from 'zod'

const signupSchema = z
  .object({
  name: z.string().min(3).max(255).trim(),
  email: z.email().max(255).toLowerCase().trim(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/\d/, "Must contain a number")
    .regex(/[@$!%*?&#]/, "Must contain a special character"),
})

const signinSchema = z.object({
  email: z.email().max(255).toLowerCase().trim(),
  password: z.string().min(8).max(32),
})

export { signupSchema, signinSchema }