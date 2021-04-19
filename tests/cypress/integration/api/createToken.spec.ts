import { apolloClient } from '../../support/apollo'
import { DocumentNode } from 'graphql'

import { getToken, getTokens, deleteToken, verifyToken } from '../../support/gql'

describe('Token creation via API - mutation.admin.personalApiTokens.createToken', () => {
    let GQL_CREATE: DocumentNode

    before('load graphql file', function () {
        GQL_CREATE = require(`graphql-tag/loader!../../fixtures/createToken.graphql`)
    })

    afterEach(async function () {
        const client = apolloClient()
        return Promise.all(
            (await getTokens({ userId: 'root' }, client)).nodes
                .filter((token) => token.name.startsWith('test-'))
                .map((token) => deleteToken(token.key, client)),
        )
    })

    it('Create token by providing userId, name, null date, null state, null siteKey', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()

        const response = await apolloClient().query({
            query: GQL_CREATE,
            variables: {
                tokenName: name,
                siteKey: null,
                expireAt: null,
                tokenState: null,
            },
        })
        expect(response.errors).to.be.undefined

        const token = response.data.admin.personalApiTokens.createToken
        expect(token).to.have.length.of.at.least(10, 'not a token')
        expect(await verifyToken(token, client)).to.be.true

        const tokenDetails = await getToken('root', name, client)
        expect(tokenDetails).to.not.be.null
        expect(tokenDetails.name).to.equals(name)
        expect(tokenDetails.state).to.equals('ACTIVE')
    })

    it('Create token by providing name, userId, null date, null siteKey, DISABLED state', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()

        const response = await apolloClient().query({
            query: GQL_CREATE,
            variables: {
                tokenName: name,
                siteKey: null,
                expireAt: null,
                tokenState: 'DISABLED',
            },
        })
        expect(response.errors).to.be.undefined

        const token = response.data.admin.personalApiTokens.createToken

        expect(token).to.have.length.of.at.least(10, 'not a token')
        expect(await verifyToken(token, client)).to.be.false

        const tokenDetails = await getToken('root', name, client)
        expect(tokenDetails).to.not.be.null
        expect(tokenDetails.name).to.equals(name)
        expect(tokenDetails.state).to.equals('DISABLED')
    })

    it('Create token by providing name, userId, null date, null siteKey, INCORRECT state (INACTIVE)', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()

        const response = await apolloClient().query({
            query: GQL_CREATE,
            variables: {
                tokenName: name,
                siteKey: null,
                expireAt: null,
                tokenState: 'INACTIVE', // This state does not exist
            },
            errorPolicy: 'ignore',
        })
        expect(response.data).to.be.null

        const tokenDetails = await getToken('root', name, client)
        expect(tokenDetails).to.be.null
    })

    it('Create token by providing userId, name, expiry date, null state, null siteKey', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()
        const expireAt = '2040-01-01'

        const response = await apolloClient().query({
            query: GQL_CREATE,
            variables: {
                tokenName: name,
                siteKey: null,
                expireAt: expireAt,
                tokenState: null,
            },
        })
        expect(response.errors).to.be.undefined

        const token = response.data.admin.personalApiTokens.createToken
        expect(token).to.have.length.of.at.least(10, 'not a token')
        expect(await verifyToken(token, client)).to.be.true

        const tokenDetails = await getToken('root', name, client)
        expect(tokenDetails).to.not.be.null
        expect(tokenDetails.state).to.equals('ACTIVE')
        // Using slice prevent us from having to deal with timezones (hopefully)
        expect(tokenDetails.expireAt.slice(0, 10)).to.equals(expireAt)
    })

    it('Create token by providing userId, name, expiry date in the past, null state, null siteKey', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()
        const expireAt = '2010-01-01'

        const response = await apolloClient().query({
            query: GQL_CREATE,
            variables: {
                tokenName: name,
                siteKey: null,
                expireAt: expireAt,
                tokenState: null,
            },
        })
        expect(response.errors).to.be.undefined

        const token = response.data.admin.personalApiTokens.createToken
        expect(token).to.have.length.of.at.least(10, 'not a token')
        expect(await verifyToken(token, client)).to.be.false

        const tokenDetails = await getToken('root', name, client)
        expect(tokenDetails).to.not.be.null
        expect(tokenDetails.state).to.equals('ACTIVE')
        expect(tokenDetails.expireAt.slice(0, 10)).to.equals(expireAt)
    })

    it('Create token by providing userId, name, INCORRECT expiry date, null state, null siteKey', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()
        const expireAt = '2010-ABCDEF-01'

        const response = await apolloClient().query({
            query: GQL_CREATE,
            variables: {
                tokenName: name,
                siteKey: null,
                expireAt: expireAt,
                tokenState: null,
            },
            errorPolicy: 'ignore',
        })
        expect(response.data.admin.personalApiTokens.createToken).to.be.null

        const tokenDetails = await getToken('root', name, client)
        expect(tokenDetails).to.be.null
    })

    it('Create token by providing userId, name, EMPTY expiry date, null state, null siteKey', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()
        const expireAt = ''

        const response = await apolloClient().query({
            query: GQL_CREATE,
            variables: {
                tokenName: name,
                siteKey: null,
                expireAt: expireAt,
                tokenState: null,
            },
            errorPolicy: 'ignore',
        })
        expect(response.data.admin.personalApiTokens.createToken).to.be.null

        const tokenDetails = await getToken('root', name, client)
        expect(tokenDetails).to.be.null
    })

    it('Create same name token by providing userId, name, expiry date, null state, null siteKey', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()
        const expireAt = '2040-01-01'

        let response = await apolloClient().query({
            query: GQL_CREATE,
            variables: {
                tokenName: name,
                siteKey: null,
                expireAt: expireAt,
                tokenState: null,
            },
        })
        expect(response.errors).to.be.undefined

        const token = response.data.admin.personalApiTokens.createToken
        expect(token).to.have.length.of.at.least(10, 'not a token')
        expect(await verifyToken(token, client)).to.be.true

        let tokenDetails = await getToken('root', name, client)
        expect(tokenDetails).to.not.be.null
        expect(tokenDetails.name).to.equals(name)

        response = await apolloClient().query({
            query: GQL_CREATE,
            variables: {
                tokenName: name,
                siteKey: null,
                expireAt: '2019-01-01',
                tokenState: null,
            },
            errorPolicy: 'ignore',
        })
        expect(response.data.admin.personalApiTokens.createToken).to.be.null

        tokenDetails = await getToken('root', name, client)
        expect(tokenDetails).to.not.be.null
        expect(tokenDetails.name).to.equals(name)
        expect(tokenDetails.expireAt.slice(0, 10)).to.equals(expireAt)
    })

    it('Create token by providing userId, NULL name, null date, null state, null siteKey', async function () {
        const name = null

        const response = await apolloClient().query({
            query: GQL_CREATE,
            variables: {
                tokenName: name,
                siteKey: null,
                expireAt: null,
                tokenState: null,
            },
            errorPolicy: 'ignore',
        })
        cy.log(JSON.stringify(response))

        expect(response.data).to.be.null
    })

    it('Create token by providing userId, EMPTY name, null date, null state, null siteKey', async function () {
        const client = apolloClient()
        const name = ''

        const response = await apolloClient().query({
            query: GQL_CREATE,
            variables: {
                tokenName: name,
                siteKey: null,
                expireAt: null,
                tokenState: null,
            },
            errorPolicy: 'ignore',
        })
        cy.log(JSON.stringify(response))
        expect(response.data.admin.personalApiTokens.createToken).to.be.null

        const tokenDetails = await getToken('root', name, client)
        expect(tokenDetails).to.be.null
    })

    it('Security - Guest user is NOT able to create a own token', async function () {
        const name = 'test-' + new Date().getTime()

        const response = await apolloClient({}).query({
            query: GQL_CREATE,
            variables: {
                tokenName: name,
                siteKey: null,
                expireAt: null,
                tokenState: null,
            },
            errorPolicy: 'ignore',
        })
        cy.log(JSON.stringify(response))
        expect(response.data.admin.personalApiTokens.createToken).to.be.null

        const client = apolloClient()
        const tokenDetails = await getToken('guest', name, client)
        expect(tokenDetails).to.be.null
    })

    it('Security - Authenticated visitor (jay) is able to create own token', async function () {
        const name = 'test-' + new Date().getTime()
        const userId = 'jay'
        const credentials = { username: userId, password: 'password' }
        const client = apolloClient(credentials)

        const response = await apolloClient(credentials).query({
            query: GQL_CREATE,
            variables: {
                tokenName: name,
                siteKey: null,
                expireAt: null,
                tokenState: null,
            },
            errorPolicy: 'ignore',
        })
        cy.log(JSON.stringify(response))
        expect(response.errors).to.be.undefined

        const token = response.data.admin.personalApiTokens.createToken
        expect(token).to.have.length.of.at.least(10, 'not a token')
        expect(await verifyToken(token, client)).to.be.true

        const tokenDetails = await getToken(userId, name, client)
        expect(tokenDetails).to.not.be.null
        expect(tokenDetails.name).to.equals(name)
        expect(tokenDetails.state).to.equals('ACTIVE')
    })

    it('Security - Editor (mathias) is able to create own token', async function () {
        const name = 'test-' + new Date().getTime()
        const userId = 'mathias'
        const credentials = { username: userId, password: 'password' }
        const client = apolloClient(credentials)

        const response = await apolloClient(credentials).query({
            query: GQL_CREATE,
            variables: {
                tokenName: name,
                siteKey: null,
                expireAt: null,
                tokenState: null,
            },
            errorPolicy: 'ignore',
        })
        cy.log(JSON.stringify(response))
        expect(response.errors).to.be.undefined

        const token = response.data.admin.personalApiTokens.createToken
        expect(token).to.have.length.of.at.least(10, 'not a token')
        expect(await verifyToken(token, client)).to.be.true

        const tokenDetails = await getToken(userId, name, client)
        expect(tokenDetails).to.not.be.null
        expect(tokenDetails.name).to.equals(name)
        expect(tokenDetails.state).to.equals('ACTIVE')
    })
})
