import { apollo } from '../../support/apollo'
import { DocumentNode } from 'graphql'

import { createToken, deleteToken, getToken, getTokens } from '../../support/gql'

describe('Token deletion via API - mutation.admin.personalApiTokens.deleteToken', () => {
    let GQL_DELETE: DocumentNode

    before('load graphql file', function () {
        GQL_DELETE = require(`graphql-tag/loader!../../fixtures/deleteToken.graphql`)
    })

    afterEach(async function () {
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        return Promise.all(
            (await getTokens({ userId: 'root' }, client)).nodes
                .filter((token) => token.name.startsWith('test-'))
                .map((token) => deleteToken(token.key, client)),
        )
    })

    it('Delete Token by providing tokenKey', async function () {
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const name = 'test-' + new Date().getTime()

        await createToken(name, null, null, client)
        const tokenDetails = await getToken('root', name, client)

        const response = await apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        }).mutate({
            mutation: GQL_DELETE,
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
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })

        await createToken('test-D-A', null, null, client)
        await createToken('test-D-B', null, null, client)
        await createToken('test-D-C', null, null, client)

        try {
            await apollo(Cypress.config().baseUrl, {
                username: 'root',
                password: Cypress.env('SUPER_USER_PASSWORD'),
            }).mutate({
                mutation: GQL_DELETE,
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
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })

        await createToken('test-E-A', null, null, client)
        await createToken('test-E-B', null, null, client)
        await createToken('test-E-C', null, null, client)

        const response = await apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        }).mutate({
            mutation: GQL_DELETE,
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
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const name = 'test-' + new Date().getTime()

        await createToken(name, null, null, client)
        const tokenDetails = await getToken('root', name, client)

        const response = await apollo(Cypress.config().baseUrl).mutate({
            mutation: GQL_DELETE,
            variables: {
                tokenKey: tokenDetails.key,
            },
        })
        cy.log(JSON.stringify(response))
        expect(response.errors).to.not.be.empty
        expect(response.data).to.be.null

        const deletedToken = await getToken('root', name, client)
        expect(deletedToken).not.to.be.null
    })

    it('Security - Authenticated user (irina) is NOT able to delete a token created by Editor (mathias)', async function () {
        const name = 'test-' + new Date().getTime()

        const mathiasApolloClient = apollo(Cypress.config().baseUrl, { username: 'mathias', password: 'password' })
        await createToken(name, null, null, mathiasApolloClient)
        const tokenDetails = await getToken('mathias', name, mathiasApolloClient)

        try {
            await apollo(Cypress.config().baseUrl, { username: 'irina', password: 'password' }).mutate({
                mutation: GQL_DELETE,
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

    it('Security - Authenticated user (irina) is NOT able to delete a token created by Root', async function () {
        const name = 'test-' + new Date().getTime()

        const rootApolloClient = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        await createToken(name, null, null, rootApolloClient)
        const tokenDetails = await getToken('root', name, rootApolloClient)

        try {
            await apollo(Cypress.config().baseUrl, { username: 'irina', password: 'password' }).mutate({
                mutation: GQL_DELETE,
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

    it('Security - Editor (mathias) is NOT able to delete a token created by Authenticated user (irina)', async function () {
        const name = 'test-' + new Date().getTime()

        const mathiasApolloClient = apollo(Cypress.config().baseUrl, { username: 'irina', password: 'password' })
        await createToken(name, null, null, mathiasApolloClient)
        const tokenDetails = await getToken('irina', name, mathiasApolloClient)

        const response = await apollo(Cypress.config().baseUrl, { username: 'mathias', password: 'password' }).mutate({
            mutation: GQL_DELETE,
            variables: {
                tokenKey: tokenDetails.key,
            },
        })
        cy.log(JSON.stringify(response))
        expect(response.errors).to.be.undefined
        expect(response.data.admin.personalApiTokens.deleteToken).to.be.false

        const deletedToken = await getToken('irina', name, mathiasApolloClient)
        expect(deletedToken).not.to.be.null
    })

    it('Security - Editor (mathias) is NOT able to delete a token created by Root', async function () {
        const name = 'test-' + new Date().getTime()

        const rootApolloClient = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        await createToken(name, null, null, rootApolloClient)
        const tokenDetails = await getToken('root', name, rootApolloClient)

        try {
            await apollo(Cypress.config().baseUrl, { username: 'mathias', password: 'password' }).mutate({
                mutation: GQL_DELETE,
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

        const mathiasApolloClient = apollo(Cypress.config().baseUrl, { username: 'mathias', password: 'password' })
        await createToken(name, null, null, mathiasApolloClient)
        const tokenDetails = await getToken('mathias', name, mathiasApolloClient)

        const response = await apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        }).mutate({
            mutation: GQL_DELETE,
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

    it('Security - Root IS able to delete a token created by Authenticated user (irina)', async function () {
        const name = 'test-' + new Date().getTime()
        const mathiasApolloClient = apollo(Cypress.config().baseUrl, { username: 'irina', password: 'password' })
        await createToken(name, null, null, mathiasApolloClient)
        const tokenDetails = await getToken('irina', name, mathiasApolloClient)

        const response = await apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        }).mutate({
            mutation: GQL_DELETE,
            variables: {
                tokenKey: tokenDetails.key,
            },
        })
        cy.log(JSON.stringify(response))
        expect(response.errors).to.be.undefined
        expect(response.data.admin.personalApiTokens.deleteToken).to.be.true

        const deletedToken = await getToken('irina', name, mathiasApolloClient)
        expect(deletedToken).to.be.null
    })
})
