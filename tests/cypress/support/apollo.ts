import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'

export const apolloClient = new ApolloClient({
    link: new HttpLink({
        uri: `${Cypress.config().baseUrl}/modules/graphql`,
        headers: {
            authorization: `Basic cm9vdA==:cm9vdA==`,
        },
    }),
    cache: new InMemoryCache(),
})
