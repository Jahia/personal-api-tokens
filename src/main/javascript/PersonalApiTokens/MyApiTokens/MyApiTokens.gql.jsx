import gql from 'graphql-tag';

const CreateTokenMutation = gql`
    mutation CreateToken($name: String!, $expireAt: String) {
        admin {
             personalApiTokens {
                 createToken(name: $name, expireAt: $expireAt)
            }
        }
    }
`;

export {CreateTokenMutation};
