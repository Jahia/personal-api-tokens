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
            (await getTokens('root', client)).nodes
                .filter((token) => token.name.startsWith('test-'))
                .map((token) => deleteToken(token.key, client)),
        )
    })

    it('Delete Token by providing tokenKey', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()

        await createToken('root', name, null, null, client)
        const tokenDetails = await getToken('root', name, client)

        const response = await apolloClient().query({
            query: GQL_DELETE,
            variables: {
                tokenKey: tokenDetails.key,
            },
        })
        expect(response.errors).to.be.undefined
        expect(response.data.admin.personalApiTokens.deleteToken).to.be.true

        const deletedToken = await getToken('root', name, client)
        expect(deletedToken).to.be.null
    })

    it('Delete Token by providing null tokenKey', async function () {
        const client = apolloClient()

        await createToken('root', 'test-D-A', null, null, client)
        await createToken('root', 'test-D-B', null, null, client)
        await createToken('root', 'test-D-C', null, null, client)

        const response = await apolloClient().query({
            query: GQL_DELETE,
            variables: {
                tokenKey: null,
            },
            errorPolicy: 'ignore',
        })

        expect(response.data).to.be.null

        // We verify that by submitting null we don't end up deleting all tokens
        const allTokens = await getTokens('root', client)
        expect(allTokens.nodes.filter((token) => token.name.startsWith('test-D-')).length).to.equal(3)
    })

    it('Delete Token by providing EMPTY tokenKey', async function () {
        const client = apolloClient()

        await createToken('root', 'test-E-A', null, null, client)
        await createToken('root', 'test-E-B', null, null, client)
        await createToken('root', 'test-E-C', null, null, client)

        const response = await apolloClient().query({
            query: GQL_DELETE,
            variables: {
                tokenKey: '',
            },
            errorPolicy: 'ignore',
        })
        expect(response.data.admin.personalApiTokens.deleteToken).to.be.false

        // We verify that by submitting null we don't end up deleting all tokens
        const allTokens = await getTokens('root', client)
        expect(allTokens.nodes.filter((token) => token.name.startsWith('test-E-')).length).to.equal(3)
    })
})
