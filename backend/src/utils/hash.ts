import bcrypt from 'bcrypt'

const hashStr = async(str: string) => {
  return await bcrypt.hash(str, 10)
}

const compareHash = async(str: string, encStr: string) => {
  return await bcrypt.compare(str, encStr)
}

export { hashStr, compareHash }