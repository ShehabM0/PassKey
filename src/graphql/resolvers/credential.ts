import { createCredential, deleteCredential, getCredential, updateCredential } from '../../services/credential.ts'
import type { Credential } from '../../db/credentials-schema.ts'
import { errorFormat } from '../../utils/error-format.ts'
import { platforms } from '../../services/platform.ts'
import { emailSchema } from '../../validation/user.ts'
import type { GraphQLContext } from '../context.ts'
import { logger } from '../../config/logger.ts'
import { encrypt } from '../../utils/encrypt.ts'

const credentialResolvers = {
  Mutation: {
    createCredential: async (
      _: unknown,
      args: { platformTitle: string, email: string, password: string },
      context: GraphQLContext
    ) => {
      try {
        const { platformTitle, email, password } = args
        const uid = context?.uid

        if (!uid)
          throw new Error('Authentication required!')

        const validation = emailSchema.safeParse({ email })
        if(!validation.success) {
          const error = errorFormat(validation.error.issues)
          throw new Error(error)
        }

        const platform = platforms.get(platformTitle)
        if(!platform)
          throw new Error('Error getting platform!')

        const encryptedPass = encrypt(password)

        const credential: Credential = {
          uid: uid,
          platformIcon: platform.path,
          platformTitle: platform.name,
          email: email,
          password: encryptedPass
        }
        const createdCredential = await createCredential(credential)
        if(!createdCredential)
          throw new Error('Credential not created!')

        return createdCredential
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Error creating credential!'
        logger.error(message)
        throw new Error(message)
      }
    },
    updateCredential: async (
      _: unknown,
      args: { credentialId: number, email: string, password: string },
      context: GraphQLContext
    ) => {
      try {
        const { credentialId, email, password } = args
        const uid = context.uid
        if (!uid)
          throw new Error('Authentication required!')

        const credential = await getCredential(credentialId)
        if(!credential)
          throw new Error('Error finding credential!')
        if (credential.uid !== uid)
          throw new Error('Forbidden. You can only access your own resources!')

        if(!email && !password)
          throw new Error('Please provide email or password.')
        if(email) {
          const validation = emailSchema.safeParse({ email })
          if(!validation.success) {
            const error = errorFormat(validation.error.issues)
            throw new Error(error)
          }
          credential.email = email
        }
        if(password) {
          const encryptedPass = encrypt(password)
          credential.password = encryptedPass
        }

        const updatedCredential = await updateCredential(credential)
        if(!updatedCredential)
          throw new Error('Credential not updated!')
        return updatedCredential
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Error updating credential!'
        logger.error(message)
        throw new Error(message)
      }
    },
    deleteCredential: async ( _: unknown, args: { credentialId: number }, context: GraphQLContext) => {
      try {
        const credentialId = Number(args.credentialId)
        const uid = context.uid
        if (!uid)
          throw new Error('Authentication required!')

        const deletedCredential = await deleteCredential(credentialId, uid)
        return (deletedCredential) ?
         { success: true, message: 'Credential deleted successfully.', } :
         { success: false, message: 'Error deleting credential!', }
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Error deleting credential!'
        logger.error(message)
        throw new Error(message)
      }
    }
  }
}

export { credentialResolvers }
