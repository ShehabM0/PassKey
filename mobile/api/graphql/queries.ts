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

export const GET_PLATFORMS = gql`
  query GetPlatforms($query: String, $offset: Int!, $limit: Int!) {
    platform {
      fetch(query: $query, offset: $offset, limit: $limit) {
        data {
          id
          slug
          name
          path
          aliases
        }
        pagination {
          nextOffset
          limit
          totalItems
          hasNextPage
        }
      }
    }
  }
`;
