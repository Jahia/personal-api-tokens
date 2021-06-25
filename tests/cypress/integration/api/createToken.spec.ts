import { apollo } from '../../support/apollo'
import { DocumentNode } from 'graphql'

import { deleteToken, getToken, getTokens, verifyToken } from '../../support/gql'

describe('Token creation via API - mutation.admin.personalApiTokens.createToken', () => {
    let GQL_CREATE: DocumentNode

    before('load graphql file', function () {
        GQL_CREATE = require(`graphql-tag/loader!../../fixtures/createToken.graphql`)
    })

    afterEach(function () {
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        return Promise.all([
            getTokens({ userId: 'root' }, client).then(t => t.nodes
                .filter((token) => token.name.startsWith('test-'))
                .map((token) => deleteToken(token.key, client))),
            getTokens({ userId: 'irina' }, client).then(t => t.nodes
                .filter((token) => token.name.startsWith('test-'))
                .map((token) => deleteToken(token.key, client))),
            getTokens({ userId: 'mathias' }, client).then(t => t.nodes
                .filter((token) => token.name.startsWith('test-'))
                .map((token) => deleteToken(token.key, client)))
        ]);
    })

    it('Create token by providing userId, name, null date, null state, null siteKey', async function () {
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const name = 'test-' + new Date().getTime()

        const response = await apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        }).mutate({
            mutation: GQL_CREATE,
            variables: {
                tokenName: name,
                siteKey: null,
                expireAt: null,
                tokenState: null,
            },
        })
        cy.log(JSON.stringify(response))
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
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const name = 'test-' + new Date().getTime()

        const response = await apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        }).mutate({
            mutation: GQL_CREATE,
            variables: {
                tokenName: name,
                siteKey: null,
                expireAt: null,
                tokenState: 'DISABLED',
            },
        })
        cy.log(JSON.stringify(response))
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
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const name = 'test-' + new Date().getTime()

        try {
            await apollo(Cypress.config().baseUrl, {
                username: 'root',
                password: Cypress.env('SUPER_USER_PASSWORD'),
            }).mutate({
                mutation: GQL_CREATE,
                variables: {
                    tokenName: name,
                    siteKey: null,
                    expireAt: null,
                    tokenState: 'INACTIVE', // This state does not exist
                },
            })
        } catch (err) {
            cy.log(JSON.stringify(err))
            expect(err.graphQLErrors[0].message).to.contain('Internal Server Error(s) while executing query')
        }

        const tokenDetails = await getToken('root', name, client)
        expect(tokenDetails).to.be.null
    })

    it('Create token by providing userId, name, expiry date, null state, null siteKey', async function () {
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const name = 'test-' + new Date().getTime()
        const expireAt = '2040-01-01'

        const response = await apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        }).mutate({
            mutation: GQL_CREATE,
            variables: {
                tokenName: name,
                siteKey: null,
                expireAt: expireAt,
                tokenState: null,
            },
        })
        cy.log(JSON.stringify(response))
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
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const name = 'test-' + new Date().getTime()
        const expireAt = '2010-01-01'

        const response = await apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        }).mutate({
            mutation: GQL_CREATE,
            variables: {
                tokenName: name,
                siteKey: null,
                expireAt: expireAt,
                tokenState: null,
            },
        })
        cy.log(JSON.stringify(response))
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
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const name = 'test-' + new Date().getTime()
        const expireAt = '2010-ABCDEF-01'

        try {
            await apollo(Cypress.config().baseUrl, {
                username: 'root',
                password: Cypress.env('SUPER_USER_PASSWORD'),
            }).mutate({
                mutation: GQL_CREATE,
                variables: {
                    tokenName: name,
                    siteKey: null,
                    expireAt: expireAt,
                    tokenState: null,
                },
            })
        } catch (err) {
            cy.log(JSON.stringify(err))
            expect(err.graphQLErrors[0].message).to.contain(
                'java.lang.IllegalArgumentException: Invalid format: "2010-ABCDEF-01" is malformed at "-ABCDEF-01"',
            )
        }

        const tokenDetails = await getToken('root', name, client)
        expect(tokenDetails).to.be.null
    })

    it('Create token by providing userId, name, EMPTY expiry date, null state, null siteKey', async function () {
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const name = 'test-' + new Date().getTime()
        const expireAt = ''

        try {
            await apollo(Cypress.config().baseUrl, {
                username: 'root',
                password: Cypress.env('SUPER_USER_PASSWORD'),
            }).mutate({
                mutation: GQL_CREATE,
                variables: {
                    tokenName: name,
                    siteKey: null,
                    expireAt: expireAt,
                    tokenState: null,
                },
            })
        } catch (err) {
            cy.log(JSON.stringify(err))
            expect(err.graphQLErrors[0].message).to.contain('java.lang.IllegalArgumentException: Invalid format: ""')
        }

        const tokenDetails = await getToken('root', name, client)
        expect(tokenDetails).to.be.null
    })

    it('Create same name token by providing userId, name, expiry date, null state, null siteKey', async function () {
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const name = 'test-' + new Date().getTime()
        const expireAt = '2040-01-01'

        const response = await apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        }).mutate({
            mutation: GQL_CREATE,
            variables: {
                tokenName: name,
                siteKey: null,
                expireAt: expireAt,
                tokenState: null,
            },
        })
        cy.log(JSON.stringify(response))
        expect(response.errors).to.be.undefined

        const token = response.data.admin.personalApiTokens.createToken
        expect(token).to.have.length.of.at.least(10, 'not a token')
        expect(await verifyToken(token, client)).to.be.true

        let tokenDetails = await getToken('root', name, client)
        expect(tokenDetails).to.not.be.null
        expect(tokenDetails.name).to.equals(name)

        try {
            await apollo(Cypress.config().baseUrl, {
                username: 'root',
                password: Cypress.env('SUPER_USER_PASSWORD'),
            }).mutate({
                mutation: GQL_CREATE,
                variables: {
                    tokenName: name,
                    siteKey: null,
                    expireAt: expireAt,
                    tokenState: null,
                },
            })
        } catch (err) {
            cy.log(JSON.stringify(err))
            expect(err.graphQLErrors[0].message).to.contain(
                'javax.jcr.ItemExistsException: This node already exists: /users/root/tokens/test',
            )
        }

        tokenDetails = await getToken('root', name, client)
        expect(tokenDetails).to.not.be.null
        expect(tokenDetails.name).to.equals(name)
        expect(tokenDetails.expireAt.slice(0, 10)).to.equals(expireAt)
    })

    it('Create token by providing userId, NULL name, null date, null state, null siteKey', async function () {
        const name = null

        try {
            await apollo(Cypress.config().baseUrl, {
                username: 'root',
                password: Cypress.env('SUPER_USER_PASSWORD'),
            }).mutate({
                mutation: GQL_CREATE,
                variables: {
                    tokenName: name,
                    siteKey: null,
                    expireAt: null,
                    tokenState: null,
                },
            })
        } catch (err) {
            cy.log(JSON.stringify(err))
            expect(err.graphQLErrors[0].message).to.contain('Internal Server Error(s) while executing query')
        }
    })

    it('Create token by providing userId, EMPTY name, null date, null state, null siteKey', async function () {
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const name = ''

        try {
            await apollo(Cypress.config().baseUrl, {
                username: 'root',
                password: Cypress.env('SUPER_USER_PASSWORD'),
            }).mutate({
                mutation: GQL_CREATE,
                variables: {
                    tokenName: name,
                    siteKey: null,
                    expireAt: null,
                    tokenState: null,
                },
            })
        } catch (err) {
            cy.log(JSON.stringify(err))
            expect(err.graphQLErrors.length).to.be.greaterThan(0)
        }

        const tokenDetails = await getToken('root', name, client)
        expect(tokenDetails).to.be.null
    })

    it('Security - Guest user is NOT able to create a own token', async function () {
        const name = 'test-' + new Date().getTime()

        try {
            await apollo(Cypress.config().baseUrl).mutate({
                mutation: GQL_CREATE,
                variables: {
                    tokenName: name,
                    siteKey: null,
                    expireAt: null,
                    tokenState: null,
                },
            })
        } catch (err) {
            cy.log(JSON.stringify(err))
            expect(err.graphQLErrors[0].message).to.contain('java.lang.IllegalArgumentException: invalid user')
        }

        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const tokenDetails = await getToken('guest', name, client)
        expect(tokenDetails).to.be.null
    })

    it('Security - Authenticated visitor (jay) is NOT able to create own token', async function () {
        const name = 'test-' + new Date().getTime()
        const userId = 'jay'
        const credentials = { username: userId, password: 'password' }

        try {
            await apollo(Cypress.config().baseUrl, credentials).mutate({
                mutation: GQL_CREATE,
                variables: {
                    tokenName: name,
                    siteKey: null,
                    expireAt: null,
                    tokenState: null,
                },
            })
        } catch (err) {
            cy.log(JSON.stringify(err))
            expect(err.graphQLErrors[0].message).to.contain('java.lang.IllegalArgumentException: invalid user')
        }

        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const tokenDetails = await getToken('guest', name, client)
        expect(tokenDetails).to.be.null
    })

    it('Security - Authenticated user (irina) is NOT able to create own token', async function () {
        const name = 'test-' + new Date().getTime()
        const userId = 'irina'
        const credentials = { username: userId, password: 'password' }
        const client = apollo(Cypress.config().baseUrl, credentials)

        const response = await apollo(Cypress.config().baseUrl, credentials).mutate({
            mutation: GQL_CREATE,
            variables: {
                tokenName: name,
                siteKey: null,
                expireAt: null,
                tokenState: null,
            },
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
        const client = apollo(Cypress.config().baseUrl, credentials)

        const response = await apollo(Cypress.config().baseUrl, credentials).mutate({
            mutation: GQL_CREATE,
            variables: {
                tokenName: name,
                siteKey: null,
                expireAt: null,
                tokenState: null,
            },
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
