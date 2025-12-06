import bcrypt from 'bcrypt'

const hashedPass = async(pass: string) => {
  return await bcrypt.hash(pass, 10)
}

const comparePass = async(pass: string, userPass: string) => {
  return await bcrypt.compare(pass, userPass)
}

export { hashedPass, comparePass }