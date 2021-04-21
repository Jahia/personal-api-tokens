import { apolloClient } from '../../support/apollo'
import { DocumentNode } from 'graphql'

import { createToken, getToken, getTokens, deleteToken } from '../../support/gql'

describe('Token deletion via API - mutation.admin.personalApiTokens.deleteToken', () => {
    let GQL_DELETE: DocumentNode

    before('load graphql file', function () {
        GQL_DELETE = require(`graphql-tag/loader!../../fixtures/deleteToken.graphql`)
    })

    afterEach(async function () {
        const client = apolloClient()
        return Promise.all(
            (await getTokens({ userId: 'root' }, client)).nodes
                .filter((token) => token.name.startsWith('test-'))
                .map((token) => deleteToken(token.key, client)),
        )
    })

    it('Delete Token by providing tokenKey', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()

        await createToken(name, null, null, client)
        const tokenDetails = await getToken('root', name, client)

        const response = await apolloClient().query({
            query: GQL_DELETE,
            variables: {
                tokenKey: tokenDetails.key,
            },
        })
        cy.log(JSON.stringify(response))
        expect(response.errors).to.be.undefined
        expect(response.data.admin.personalApiTokens.deleteToken).to.be.true

        const deletedToken = await getToken('root', name, client)
        expect(deletedToken).to.be.null
    })

    it('Delete Token by providing null tokenKey', async function () {
        const client = apolloClient()

        await createToken('test-D-A', null, null, client)
        await createToken('test-D-B', null, null, client)
        await createToken('test-D-C', null, null, client)

        try {
            await apolloClient().query({
                query: GQL_DELETE,
                variables: {
                    tokenKey: null,
                },
            })
        } catch (err) {
            cy.log(JSON.stringify(err))
            expect(err.graphQLErrors[0].message).to.contain('Internal Server Error(s) while executing query')
        }

        // We verify that by submitting null we don't end up deleting all tokens
        const allTokens = await getTokens({ userId: 'root' }, client)
        expect(allTokens.nodes.filter((token) => token.name.startsWith('test-D-')).length).to.equal(3)
    })

    it('Delete Token by providing EMPTY tokenKey', async function () {
        const client = apolloClient()

        await createToken('test-E-A', null, null, client)
        await createToken('test-E-B', null, null, client)
        await createToken('test-E-C', null, null, client)

        const response = await apolloClient().query({
            query: GQL_DELETE,
            variables: {
                tokenKey: '',
            },
        })
        cy.log(JSON.stringify(response))
        expect(response.data.admin.personalApiTokens.deleteToken).to.be.false

        // We verify that by submitting null we don't end up deleting all tokens
        const allTokens = await getTokens({ userId: 'root' }, client)
        expect(allTokens.nodes.filter((token) => token.name.startsWith('test-E-')).length).to.equal(3)
    })

    it('Security - Guest is NOT able to delete a token created by Root', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()

        await createToken(name, null, null, client)
        const tokenDetails = await getToken('root', name, client)

        const response = await apolloClient({}).query({
            query: GQL_DELETE,
            variables: {
                tokenKey: tokenDetails.key,
            },
        })
        cy.log(JSON.stringify(response))
        expect(response.errors).to.be.undefined
        expect(response.data.admin.personalApiTokens.deleteToken).to.be.false

        const deletedToken = await getToken('root', name, client)
        expect(deletedToken).not.to.be.null
    })

    it('Security - Authenticated visitor (jay) is NOT able to delete a token created by Editor (mathias)', async function () {
        const name = 'test-' + new Date().getTime()

        const mathiasApolloClient = apolloClient({ username: 'mathias', password: 'password' })
        await createToken(name, null, null, mathiasApolloClient)
        const tokenDetails = await getToken('mathias', name, mathiasApolloClient)

        try {
            await apolloClient({ username: 'jay', password: 'password' }).query({
                query: GQL_DELETE,
                variables: {
                    tokenKey: tokenDetails.key,
                },
            })
        } catch (err) {
            cy.log(JSON.stringify(err))
            expect(err.graphQLErrors[0].message).to.contain('java.lang.IllegalArgumentException: invalid user')
        }

        const deletedToken = await getToken('mathias', name, mathiasApolloClient)
        expect(deletedToken).not.to.be.null
    })

    it('Security - Authenticated visitor (jay) is NOT able to delete a token created by Root', async function () {
        const name = 'test-' + new Date().getTime()

        const rootApolloClient = apolloClient()
        await createToken(name, null, null, rootApolloClient)
        const tokenDetails = await getToken('root', name, rootApolloClient)

        const response = await apolloClient({ username: 'root', password: 'password' }).query({
            query: GQL_DELETE,
            variables: {
                tokenKey: tokenDetails.key,
            },
        })
        cy.log(JSON.stringify(response))
        expect(response.errors).to.be.undefined
        expect(response.data.admin.personalApiTokens.deleteToken).to.be.false

        const deletedToken = await getToken('root', name, rootApolloClient)
        expect(deletedToken).not.to.be.null
    })

    it('Security - Editor (mathias) is NOT able to delete a token created by Authenticated user (jay)', async function () {
        const name = 'test-' + new Date().getTime()

        const mathiasApolloClient = apolloClient({ username: 'jay', password: 'password' })
        await createToken(name, null, null, mathiasApolloClient)
        const tokenDetails = await getToken('jay', name, mathiasApolloClient)

        const response = await apolloClient({ username: 'mathias', password: 'password' }).query({
            query: GQL_DELETE,
            variables: {
                tokenKey: tokenDetails.key,
            },
        })
        cy.log(JSON.stringify(response))
        expect(response.errors).to.be.undefined
        expect(response.data.admin.personalApiTokens.deleteToken).to.be.false

        const deletedToken = await getToken('jay', name, mathiasApolloClient)
        expect(deletedToken).not.to.be.null
    })

    it('Security - Editor (mathias) is NOT able to delete a token created by Root', async function () {
        const name = 'test-' + new Date().getTime()

        const rootApolloClient = apolloClient()
        await createToken(name, null, null, rootApolloClient)
        const tokenDetails = await getToken('root', name, rootApolloClient)

        try {
            await apolloClient({ username: 'mathias', password: 'password' }).query({
                query: GQL_DELETE,
                variables: {
                    tokenKey: tokenDetails.key,
                },
            })
        } catch (err) {
            cy.log(JSON.stringify(err))
            expect(err.graphQLErrors[0].message).to.contain('java.lang.IllegalArgumentException: invalid user')
        }

        const deletedToken = await getToken('root', name, rootApolloClient)
        expect(deletedToken).not.to.be.null
    })

    it('Security - Root IS able to delete a token created by Editor (mathias)', async function () {
        const name = 'test-' + new Date().getTime()

        const mathiasApolloClient = apolloClient({ username: 'mathias', password: 'password' })
        await createToken(name, null, null, mathiasApolloClient)
        const tokenDetails = await getToken('mathias', name, mathiasApolloClient)

        const response = await apolloClient().query({
            query: GQL_DELETE,
            variables: {
                tokenKey: tokenDetails.key,
            },
        })
        cy.log(JSON.stringify(response))
        expect(response.errors).to.be.undefined
        expect(response.data.admin.personalApiTokens.deleteToken).to.be.true

        const deletedToken = await getToken('mathias', name, mathiasApolloClient)
        expect(deletedToken).to.be.null
    })

    it('Security - Root IS able to delete a token created by Authenticated user (jay)', async function () {
        const name = 'test-' + new Date().getTime()

        const mathiasApolloClient = apolloClient({ username: 'jay', password: 'password' })
        await createToken(name, null, null, mathiasApolloClient)
        const tokenDetails = await getToken('jay', name, mathiasApolloClient)

        const response = await apolloClient({ username: 'root', password: 'root1234' }).query({
            query: GQL_DELETE,
            variables: {
                tokenKey: tokenDetails.key,
            },
        })
        cy.log(JSON.stringify(response))
        expect(response.errors).to.be.undefined
        expect(response.data.admin.personalApiTokens.deleteToken).to.be.true

        const deletedToken = await getToken('jay', name, mathiasApolloClient)
        expect(deletedToken).to.be.null
    })
})
