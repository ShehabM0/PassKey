import { gql } from '@apollo/client/core';

export const CREATE_CREDENTIAL = gql`
  mutation CreateCredential(
    $platformTitle: String!
    $email: String!
    $password: String!
  ) {
    createCredential(
      platformTitle: $platformTitle
      email: $email
      password: $password
    ) {
      id
      platformIcon
      platformTitle
      platformColor
      email
      password
      created_at
      updated_at
    }
  }
`;

export const UPDATE_CREDENTIAL = gql`
  mutation UpdateCredential(
    $credentialId: ID!
    $platformTitle: String
    $email: String
    $password: String
  ) {
    updateCredential(
      credentialId: $credentialId
      platformTitle: $platformTitle
      email: $email
      password: $password
    ) {
      id
      platformIcon
      platformTitle
      platformColor
      email
      password
      created_at
      updated_at
    }
  }
`;

export const DELETE_CREDENTIAL = gql`
  mutation DeleteCredential($credentialId: ID!) {
    deleteCredential(credentialId: $credentialId) {
      success
      message
    }
  }
`;
