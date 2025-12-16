import z from 'zod'

const credentialSchema = z.object({ 
  title: z.string().min(3).max(255).trim(),
  email: z.email().max(255).toLowerCase().trim(),
  password: z.string()
})

export { credentialSchema }

