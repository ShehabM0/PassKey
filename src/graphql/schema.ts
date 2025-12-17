import { gql } from 'graphql-tag'

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    credentials(page: Int, limit: Int): CredentialConnection!
  }

  type CredentialConnection {
    data: [Credential!]!
    pagination: Pagination!
  }

  type Credential {
    id: ID!
    platformIcon: String!
    platformTitle: String!
    email: String!
    password: String!
    created_at: String!
    updated_at: String!
  }

  type Pagination {
    currentPage: Int!
    pageSize: Int!
    totalItems: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type Query {
    me: User
  }

  type Result {
    success: Boolean!
    message: String
  }

  type Mutation {
    createCredential(platformTitle: String!, email: String!, password: String!): Credential!
    updateCredential(credentialId: Int!, email: String, password: String): Credential!
    deleteCredential(credentialId: Int!): Result!
  }
`
