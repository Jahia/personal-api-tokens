/* eslint-disable @typescript-eslint/no-explicit-any */
import gql from 'graphql-tag'
import { ApolloClient, NormalizedCacheObject } from 'apollo-client-preset'

export async function createToken(
    userId: string,
    name: string,
    state: string,
    expireAt: string,
    apolloClient: ApolloClient<NormalizedCacheObject>,
): Promise<any> {
    const response = await apolloClient.mutate({
        mutation: gql`
            mutation($userId: String!, $name: String!, $expireAt: String, $state: TokenState) {
                admin {
                    personalApiTokens {
                        createToken(userId: $userId, name: $name, expireAt: $expireAt, state: $state)
                    }
                }
            }
        `,
        variables: {
            userId,
            name,
            state,
            expireAt,
        },
    })
    console.log(expireAt)
    return response.data.admin.personalApiTokens.createToken
}

export async function verifyToken(
    token: Promise<any>,
    apolloClient: ApolloClient<NormalizedCacheObject>,
): Promise<any> {
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
                            lastUsedAt
                        }
                    }
                }
            }
        `,
        variables: {
            userId,
            tokenName,
        },
    })
    return response.data.admin.personalApiTokens.tokenByUserAndName
}

export async function getTokens(userId: string, apolloClient: ApolloClient<NormalizedCacheObject>): Promise<any> {
    const response = await apolloClient.query({
        query: gql`
            query($userId: String!) {
                admin {
                    personalApiTokens {
                        tokens(userId: $userId) {
                            pageInfo {
                                totalCount
                            }
                            nodes {
                                name
                                key
                                expireAt
                                state
                                lastUsedAt
                            }
                        }
                    }
                }
            }
        `,
        variables: {
            userId,
        },
    })
    return response.data.admin.personalApiTokens.tokens
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
