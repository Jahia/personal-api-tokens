import { apolloClient } from '../../support/apollo'
import { DocumentNode } from 'graphql'

import { createToken, deleteToken, getToken, getTokens } from '../../support/gql'

describe('List tokens via API - query.admin.personalApiTokens.tokens', () => {
    let GQL_TOKENS: DocumentNode

    before('load graphql file', function () {
        GQL_TOKENS = require(`graphql-tag/loader!../../fixtures/listTokens.graphql`)
    })

    afterEach(async function () {
        const client = apolloClient()
        return Promise.all(
            (await getTokens('root', client)).nodes
                .filter((token) => token.name.startsWith('test-'))
                .map((token) => deleteToken(token.key, client)),
        )
    })

    it('Create 5 tokens and list them', async function () {
        const client = apolloClient()
        await createToken('root', 'test-X-A', null, null, client)
        await createToken('root', 'test-X-B', null, null, client)
        await createToken('root', 'test-X-C', null, null, client)
        await createToken('root', 'test-X-D', null, null, client)
        await createToken('root', 'test-X-E', null, null, client)

        const response = await apolloClient().query({
            query: GQL_TOKENS,
        })
        expect(response.errors).to.be.undefined

        const tokens = response.data.admin.personalApiTokens.tokens.nodes.filter((token) =>
            token.name.startsWith('test-X-'),
        )
        expect(tokens.length).to.equal(5)

        tokens.forEach((token) => {
            expect(token.name).to.include('test-X-')
            expect(token.state).to.equal('ACTIVE')
            expect(token.createdAt).to.include('202')
            expect(token.expireAt).to.be.null
            expect(token.user.name).to.equal(Cypress.env('JAHIA_USERNAME'))
        })
    })

    it('Security - Guest NOT able to list any tokens', async function () {
        const client = apolloClient()
        await createToken('root', 'test-X-A', null, null, client)
        await createToken('root', 'test-X-B', null, null, client)
        await createToken('root', 'test-X-C', null, null, client)
        await createToken('root', 'test-X-D', null, null, client)
        await createToken('root', 'test-X-E', null, null, client)

        const response = await apolloClient({}).query({
            query: GQL_TOKENS,
            errorPolicy: 'ignore',
        })
        expect(response.errors).to.be.undefined
        cy.log(JSON.stringify(response))
        if (response.data.admin.personalApiTokens.tokens === null) {
            expect(response.data.admin.personalApiTokens.tokens).to.be.null
        } else {
            expect(response.data.admin.personalApiTokens.tokens.nodes.length).to.equal(0)
        }
    })
})

describe('Get single token via API - query.admin.personalApiTokens.tokenByKey', () => {
    let GQL_TOKEN: DocumentNode

    before('load graphql file', function () {
        GQL_TOKEN = require(`graphql-tag/loader!../../fixtures/tokenByKey.graphql`)
    })

    afterEach(async function () {
        const client = apolloClient()
        return Promise.all(
            (await getTokens('root', client)).nodes
                .filter((token) => token.name.startsWith('test-'))
                .map((token) => deleteToken(token.key, client)),
        )
    })

    it('Create a token and fetch it', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()

        await createToken('root', name, null, null, client)
        const token = await getToken('root', name, client)

        const response = await apolloClient().query({
            query: GQL_TOKEN,
            variables: {
                tokenKey: token.key,
            },
        })
        expect(response.errors).to.be.undefined
        const fetchedToken = response.data.admin.personalApiTokens.tokenByKey
        expect(fetchedToken.name).to.equal(name)
    })

    it('Fetch a token using a key that does not exist anymore', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()

        await createToken('root', name, null, null, client)
        const token = await getToken('root', name, client)
        await deleteToken(token.key, client)

        const response = await apolloClient().query({
            query: GQL_TOKEN,
            variables: {
                tokenKey: token.key,
            },
        })
        expect(response.errors).to.be.undefined
        expect(response.data.admin.personalApiTokens.tokenByKey).to.be.null
    })

    it('Fetch a token passing a null key', async function () {
        const response = await apolloClient().query({
            query: GQL_TOKEN,
            variables: {
                tokenKey: null,
            },
            errorPolicy: 'ignore',
        })
        expect(response.data).to.be.null
    })

    it('Fetch a token passing an EMPTY key', async function () {
        const response = await apolloClient().query({
            query: GQL_TOKEN,
            variables: {
                tokenKey: '',
            },
            errorPolicy: 'ignore',
        })
        expect(response.data.admin.personalApiTokens.tokenByKey).to.be.null
    })

    it('Security - Guest NOT able to get a token created by root', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()

        await createToken('root', name, null, null, client)
        const token = await getToken('root', name, client)

        const response = await apolloClient({}).query({
            query: GQL_TOKEN,
            variables: {
                tokenKey: token.key,
            },
        })
        cy.log(JSON.stringify(response))
        expect(response.errors).to.be.undefined
        expect(response.data.admin.personalApiTokens.tokenByKey).to.be.null
    })

    it('Security - Authenticated visitor (jay) NOT able to get a token created by root', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()

        await createToken('root', name, null, null, client)
        const token = await getToken('root', name, client)

        const response = await apolloClient({ username: 'jay', password: 'password' }).query({
            query: GQL_TOKEN,
            variables: {
                tokenKey: token.key,
            },
        })
        cy.log(JSON.stringify(response))
        expect(response.errors).to.be.undefined
        expect(response.data.admin.personalApiTokens.tokenByKey).to.be.null
    })

    it('Security - Editor (mathias) NOT able to get a token created by root', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()

        await createToken('root', name, null, null, client)
        const token = await getToken('root', name, client)

        const response = await apolloClient({ username: 'mathias', password: 'password' }).query({
            query: GQL_TOKEN,
            variables: {
                tokenKey: token.key,
            },
        })
        cy.log(JSON.stringify(response))
        expect(response.errors).to.be.undefined
        expect(response.data.admin.personalApiTokens.tokenByKey).to.be.null
    })

    it('Security - Editor (mathias) NOT able to get a token created by Authenticated user (jay)', async function () {
        const name = 'test-' + new Date().getTime()

        await createToken('jay', name, null, null, apolloClient({ username: 'jay', password: 'password' }))
        const token = await getToken('jay', name, apolloClient({ username: 'jay', password: 'password' }))

        const response = await apolloClient({ username: 'mathias', password: 'password' }).query({
            query: GQL_TOKEN,
            variables: {
                tokenKey: token.key,
            },
        })
        cy.log(JSON.stringify(response))
        expect(response.errors).to.be.undefined
        expect(response.data.admin.personalApiTokens.tokenByKey).to.be.null
    })
})
