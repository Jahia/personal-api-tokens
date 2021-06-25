import gql from 'graphql-tag';

const GetScopesQuery = gql`query {
    admin{
        personalApiTokens {
            availableScopes {
                name
                description
            }
        }
    }
}`;

export {GetScopesQuery};
