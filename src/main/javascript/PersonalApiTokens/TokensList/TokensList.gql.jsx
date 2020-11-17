import gql from 'graphql-tag';

const getTokens = gql`
   query GetTokens($userId: String, $site: String, $before: String, $after: String, 
   $first: Int, $last: Int, $offset: Int, $limit: Int, $fieldSorter: InputFieldSorterInput) {
        admin {
          personalApiTokens {
            tokens(userId: $userId, site: $site, before: $before, after: $after, first: $first, 
            last: $last, offset: $offset, limit: $limit, fieldSorter: $fieldSorter) {
              pageInfo {
                totalCount
                nodesCount
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
              }
              nodes {
                name
                key
                expireAt
                state
                createdAt
                updatedAt
                user {
                    name
                }
              }
            }
          }
        }
     }
`;

const DeleteTokenMutation = gql`
    mutation DeleteToken($key: String!) {
        admin {
             personalApiTokens {
                 deleteToken(key: $key)
            }
        }
    }
`;

export {DeleteTokenMutation, getTokens};
