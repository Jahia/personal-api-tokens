/* eslint-disable @typescript-eslint/no-explicit-any */
import gql from 'graphql-tag'
import { ApolloClient, NormalizedCacheObject, OperationVariables } from '@apollo/client/core'
import { apollo } from './apollo'

export async function createToken(
    name: string,
    state: string,
    expireAt: string,
    apolloClient: ApolloClient<NormalizedCacheObject>,
): Promise<any> {
    const response = await apolloClient.mutate({
        mutation: gql`
            mutation($name: String!, $expireAt: String, $state: TokenState) {
                admin {
                    personalApiTokens {
                        createToken(name: $name, expireAt: $expireAt, state: $state)
                    }
                }
            }
        `,
        variables: {
            name,
            state,
            expireAt,
        },
    })
    console.log(expireAt)
    return response.data.admin.personalApiTokens.createToken
}

export async function verifyToken(token: string, apolloClient: ApolloClient<NormalizedCacheObject>): Promise<any> {
    const response = await apolloClient.query({
        query: gql`
            query($token: String!) {
                admin {
                    personalApiTokens {
                        verifyToken(token: $token)
                    }
                }
            }
        `,
        variables: {
            token,
        },
    })
    return response.data.admin.personalApiTokens.verifyToken
}

export async function getToken(
    userId: string,
    tokenName: string,
    apolloClient: ApolloClient<NormalizedCacheObject>,
): Promise<any> {
    const response = await apolloClient.query({
        query: gql`
            query($userId: String!, $tokenName: String!) {
                admin {
                    personalApiTokens {
                        tokenByUserAndName(userId: $userId, tokenName: $tokenName) {
                            name
                            key
                            expireAt
                            state
                        }
                    }
                }
            }
        `,
        fetchPolicy: 'no-cache',
        variables: {
            userId,
            tokenName,
        },
    })
    return response.data.admin.personalApiTokens.tokenByUserAndName
}

export async function getTokens(
    variables: OperationVariables,
    client?: ApolloClient<NormalizedCacheObject>,
): Promise<any> {
    if (!client) {
        client = apollo(Cypress.config().baseUrl, { username: 'root', password: Cypress.env('SUPER_USER_PASSWORD') })
    }
    const response = await client.query({
        query: gql`
            query($userId: String, $limit: Int, $offset: Int, $sort: InputFieldSorterInput) {
                admin {
                    personalApiTokens {
                        tokens(userId: $userId, limit: $limit, offset: $offset, fieldSorter: $sort) {
                            pageInfo {
                                totalCount
                                hasNextPage
                                hasPreviousPage
                            }
                            nodes {
                                name
                                key
                                expireAt
                                state
                            }
                        }
                    }
                }
            }
        `,
        fetchPolicy: 'no-cache',
        variables,
    })
    return {
        ...response,
        ...response.data.admin.personalApiTokens.tokens,
    }
}

export async function deleteToken(key: string, apolloClient: ApolloClient<NormalizedCacheObject>): Promise<any> {
    const response = await apolloClient.mutate({
        mutation: gql`
            mutation($key: String!) {
                admin {
                    personalApiTokens {
                        deleteToken(key: $key)
                    }
                }
            }
        `,
        variables: {
            key,
        },
    })
    return response.data.admin.personalApiTokens.deleteToken
}

export async function updateToken(
    key: string,
    name: string,
    state: string,
    expireAt: string,
    apolloClient: ApolloClient<NormalizedCacheObject>,
): Promise<any> {
    const response = await apolloClient.mutate({
        mutation: gql`
            mutation($key: String!, $name: String, $state: TokenState, $expireAt: String) {
                admin {
                    personalApiTokens {
                        updateToken(key: $key, name: $name, state: $state, expireAt: $expireAt)
                    }
                }
            }
        `,
        variables: {
            key,
            name,
            state,
            expireAt,
        },
    })
    return response.data.admin.personalApiTokens.updateToken
}
