import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from 'apollo-client-preset'

export const apolloClient = (authToken?: string): ApolloClient<NormalizedCacheObject> => {
    const headers: string =
        authToken ?? `Basic ${btoa(Cypress.env('JAHIA_USERNAME') + ':' + Cypress.env('JAHIA_PASSWORD'))}`
    cy.log(headers)

    return new ApolloClient({
        link: new HttpLink({
            uri: `${Cypress.config().baseUrl}/modules/graphql`,
            headers: {
                authorization: headers,
            },
        }),
        cache: new InMemoryCache(),
        defaultOptions: {
            query: {
                fetchPolicy: 'no-cache',
            },
        },
    })
}
