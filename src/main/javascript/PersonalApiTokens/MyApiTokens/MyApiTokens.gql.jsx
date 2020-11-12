import gql from 'graphql-tag';

const CreateTokenMutation = gql`
    mutation CreateToken($userId: String!, $name: String!, $expireAt: String!) {
        admin {
             personalApiTokens {
                 createToken(userId: $userId, name: $name, expireAt: $expireAt)
            }
        }
    }
`;

const getTokenData = gql`
    query GetTokenData($token: String!) {
          admin {
            personalApiTokens {
             token(token: $token) {
               key
               name
               user {
                 name
               }
             }
            }
          }
        }
`;

const getCurrentUserName = gql`
    {
      currentUser {
        name
      }
    }
`;

export {CreateTokenMutation, getTokenData, getCurrentUserName};
