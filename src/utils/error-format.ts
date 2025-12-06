import type { ZodIssue } from 'zod';

export const errorFormat = (err: ZodIssue[]) => {
  return err.map(e => e.message).join(', ')
}
