import crypto from 'crypto';

const SECRETKEY = process.env.ENC_SECRET!;
const ALGORITHM = 'aes-256-gcm';
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const IV_LENGTH = 16;

const encrypt = (text: string) => {
  const key = crypto.scryptSync(SECRETKEY, 'salt', KEY_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  const combined = Buffer.concat([iv, Buffer.from(encrypted, 'hex'), authTag]);
  return combined.toString('base64');
}

const decrypt = (encryptedData: string) => {
  const combined = Buffer.from(encryptedData, 'base64');
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(combined.length - AUTH_TAG_LENGTH);
  const encrypted = combined.subarray(IV_LENGTH, combined.length - AUTH_TAG_LENGTH);
  
  const key = crypto.scryptSync(SECRETKEY, 'salt', KEY_LENGTH);
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString('utf8');
}

const hashToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export { encrypt, decrypt, hashToken }