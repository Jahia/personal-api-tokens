import gql from 'graphql-tag';

const CreateTokenMutation = gql`
    mutation CreateToken($name: String!, $expireAt: String, $scopes: [String]) {
        admin {
             personalApiTokens {
                 createToken(name: $name, expireAt: $expireAt, scopes: $scopes)
            }
        }
    }
`;

export {CreateTokenMutation};
