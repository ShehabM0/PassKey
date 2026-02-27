import { gql } from 'graphql-tag'

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    credentials(page: Int, limit: Int): CredentialConnection!
  }

  type CredentialConnection {
    data: [CredentialDAO!]!
    pagination: PagePagination!
  }

  type CredentialDAO {
    id: ID!
    platformIcon: String!
    platformTitle: String!
    platformColor: String!
    email: String!
    created_at: String!
    updated_at: String!
  }

  type PagePagination {
    currentPage: Int!
    pageSize: Int!
    totalItems: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type PlatformConnection {
    data: [PlatformDAO!]!
    pagination: ListPagination!
  }

  type PlatformDAO {
    id: Int
    slug: String!
    name: String!
    path: String!
    color: String!
    aliases: [String]
  }

  type ListPagination {
    nextOffset: Int!
    limit: Int!
    totalItems: Int!
    hasNextPage: Boolean!
  }


  type Response {
    success: Boolean!
    message: String
  }

  type Platform {
    fetch(query: String, offset: Int!, limit: Int!): PlatformConnection!
  }

  type Query {
    me: User
    platform: Platform!
    relatedCredentials(id: Int!, page: Int, limit: Int): CredentialConnection!
    revealCredentialPassword(id: String!): String!
  }

  type Mutation {
    createCredential(platformTitle: String!, email: String!, password: String!): CredentialDAO!
    updateCredential(credentialId: Int!, email: String, password: String): CredentialDAO!
    deleteCredential(credentialId: Int!): Response!
  }
`
