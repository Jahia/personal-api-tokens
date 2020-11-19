import gql from 'graphql-tag';

const CreateTokenMutation = gql`
    mutation CreateToken($name: String!, $expireAt: String!) {
        admin {
             personalApiTokens {
                 createToken(name: $name, expireAt: $expireAt)
            }
        }
    }
`;

const getUserInformation = gql`
    query getUserInformation($userPath: String!) {
        jcr {
            nodeByPath(path: $userPath) {
                name
                displayName
            }
        }
    }
`;

export {CreateTokenMutation, getUserInformation};
