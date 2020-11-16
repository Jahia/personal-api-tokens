import { apolloClient } from '../../support/apollo'
import { DocumentNode } from 'graphql'

import { createToken, deleteToken, getToken, getTokens } from '../../support/gql'

describe('Validate ability to use token', () => {
    let GQL_APIUSER: DocumentNode

    before('load graphql file', function () {
        GQL_APIUSER = require(`graphql-tag/loader!../../fixtures/getApiUser.graphql`)
    })

    afterEach(async function () {
        const client = apolloClient()
        return Promise.all(
            (await getTokens('root', client)).nodes
                .filter((token) => token.name.startsWith('test-'))
                .map((token) => deleteToken(token.key, client)),
        )
    })

    it('Authenticated user (jay) creates token, use it', async function () {
        const name = 'test-' + new Date().getTime()
        const createdToken = await createToken(
            'jay',
            name,
            null,
            null,
            apolloClient({ username: 'jay', password: 'password' }),
        )

        const tokenDetails = await getToken('jay', name, apolloClient({ username: 'jay', password: 'password' }))
        cy.log(JSON.stringify(tokenDetails))
        expect(tokenDetails.lastUsedAt).to.be.null

        const response = await apolloClient({ token: createdToken }).query({
            query: GQL_APIUSER,
        })
        expect(response.errors).to.be.undefined
        expect(response.data.currentUser.name).to.equal('jay')
    })

    it('Editor (mathias) creates token and use it', async function () {
        const name = 'test-' + new Date().getTime()
        const createdToken = await createToken(
            'mathias',
            name,
            null,
            null,
            apolloClient({ username: 'mathias', password: 'password' }),
        )

        const tokenDetails = await getToken(
            'mathias',
            name,
            apolloClient({ username: 'mathias', password: 'password' }),
        )
        cy.log(JSON.stringify(tokenDetails))
        expect(tokenDetails.lastUsedAt).to.be.null

        const response = await apolloClient({ token: createdToken }).query({
            query: GQL_APIUSER,
        })
        expect(response.errors).to.be.undefined
        expect(response.data.currentUser.name).to.equal('mathias')
    })

    it('Root creates token and use it', async function () {
        const name = 'test-' + new Date().getTime()
        const createdToken = await createToken('root', name, null, null, apolloClient())

        const tokenDetails = await getToken('root', name, apolloClient())
        cy.log(JSON.stringify(tokenDetails))
        expect(tokenDetails.lastUsedAt).to.be.null

        const response = await apolloClient({ token: createdToken }).query({
            query: GQL_APIUSER,
        })
        expect(response.errors).to.be.undefined
        expect(response.data.currentUser.name).to.equal('root')
    })
})
