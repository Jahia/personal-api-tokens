import { apollo } from '../../support/apollo'
import { DocumentNode } from 'graphql'

import { createToken, deleteToken, getToken, getTokens } from '../../support/gql'

describe('Validate ability to use token', () => {
    let GQL_APIUSER: DocumentNode

    before('load graphql file', function () {
        GQL_APIUSER = require(`graphql-tag/loader!../../fixtures/getApiUser.graphql`)
    })

    afterEach(function () {
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        return Promise.all([
            getTokens({ userId: 'root' }, client).then((t) =>
                t.nodes
                    .filter((token) => token.name.startsWith('test-'))
                    .map((token) => deleteToken(token.key, client)),
            ),
            getTokens({ userId: 'irina' }, client).then((t) =>
                t.nodes
                    .filter((token) => token.name.startsWith('test-'))
                    .map((token) => deleteToken(token.key, client)),
            ),
            getTokens({ userId: 'mathias' }, client).then((t) =>
                t.nodes
                    .filter((token) => token.name.startsWith('test-'))
                    .map((token) => deleteToken(token.key, client)),
            ),
        ])
    })

    it('Authenticated user (irina) creates token, use it', async function () {
        const name = 'test-' + new Date().getTime()
        const createdToken = await createToken(
            name,
            null,
            null,
            apollo(Cypress.config().baseUrl, { username: 'irina', password: 'password' }),
        )

        const tokenDetails = await getToken(
            'irina',
            name,
            apollo(Cypress.config().baseUrl, { username: 'irina', password: 'password' }),
        )
        cy.log(JSON.stringify(tokenDetails))

        const response = await apollo(Cypress.config().baseUrl, { token: createdToken }).query({
            query: GQL_APIUSER,
        })
        expect(response.errors).to.be.undefined
        expect(response.data.currentUser.name).to.equal('irina')
    })

    it('Editor (mathias) creates token and use it', async function () {
        const name = 'test-' + new Date().getTime()
        const createdToken = await createToken(
            name,
            null,
            null,
            apollo(Cypress.config().baseUrl, { username: 'mathias', password: 'password' }),
        )

        const tokenDetails = await getToken(
            'mathias',
            name,
            apollo(Cypress.config().baseUrl, { username: 'mathias', password: 'password' }),
        )
        cy.log(JSON.stringify(tokenDetails))

        const response = await apollo(Cypress.config().baseUrl, { token: createdToken }).query({
            query: GQL_APIUSER,
        })
        expect(response.errors).to.be.undefined
        expect(response.data.currentUser.name).to.equal('mathias')
    })

    it('Root creates token and use it', async function () {
        const name = 'test-' + new Date().getTime()
        const createdToken = await createToken(
            name,
            null,
            null,
            apollo(Cypress.config().baseUrl, { username: 'root', password: Cypress.env('SUPER_USER_PASSWORD') }),
        )

        const tokenDetails = await getToken(
            'root',
            name,
            apollo(Cypress.config().baseUrl, { username: 'root', password: Cypress.env('SUPER_USER_PASSWORD') }),
        )
        cy.log(JSON.stringify(tokenDetails))

        const response = await apollo(Cypress.config().baseUrl, { token: createdToken }).query({
            query: GQL_APIUSER,
        })
        expect(response.errors).to.be.undefined
        expect(response.data.currentUser.name).to.equal('root')
    })
})
