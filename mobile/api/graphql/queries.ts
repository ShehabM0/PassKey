import { gql } from '@apollo/client/core';

const GET_USER = gql`
  query Me {
    me {
      id
      name
      email
    }
  }
`;

export const GET_USER_CREDENTIALS = gql`
  query GetUserCredentials($page: Int!, $limit: Int!) {
    me {
      credentials(page: $page, limit: $limit) {
        data {
          id
          platformIcon
          platformTitle
          email
          password
          created_at
          updated_at
        }
        pagination {
          currentPage
          pageSize
          totalItems
          totalPages
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
`;

export default { 
  GET_USER, GET_USER_CREDENTIALS
};