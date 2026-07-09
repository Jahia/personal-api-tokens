import { apollo } from '../../support/apollo'
import { DocumentNode } from 'graphql'

import { createToken, getToken } from '../../support/gql'

// Regression: the updateToken / deleteToken mutations must require the same
// "personal-api-tokens" permission that createToken already requires. A privileged
// administrator who does NOT hold that permission must not be able to update or
// delete tokens, while a permission holder keeps full control of their own tokens.
// Fully self-contained (CI-ready): a groovy fixture provisions its own roles + users
// in before() and removes them in after().
describe('Personal API token mutations - permission consistency', () => {
    let GQL_UPDATE: DocumentNode
    let GQL_DELETE: DocumentNode

    const HOLDER = { username: 'patTokenHolder', password: 'PatHolder123!' }
    const ADMIN_NO_TOKEN = { username: 'patAdminNoToken', password: 'PatNoToken123!' }

    before('load fixtures and provision principals', function () {
        GQL_UPDATE = require(`graphql-tag/loader!../../fixtures/updateToken.graphql`)
        GQL_DELETE = require(`graphql-tag/loader!../../fixtures/deleteToken.graphql`)
        cy.executeGroovy('groovy/patTokenPermissionSetup.groovy', {}).then((raw) => {
            if (String(raw ?? '').includes('.failed')) {
                throw new Error(`patTokenPermissionSetup failed: ${raw}`)
            }
        })
    })

    after('remove provisioned principals', function () {
        cy.executeGroovy('groovy/patTokenPermissionTeardown.groovy', {})
    })

    it('rejects updateToken for a privileged admin without the token permission', async function () {
        const client = apollo(Cypress.config().baseUrl, ADMIN_NO_TOKEN)
        const response = await client.mutate({
            mutation: GQL_UPDATE,
            variables: { tokenKey: 'no-such-key', tokenName: 'x', expireAt: null, tokenState: null },
        })
        expect(response.errors, JSON.stringify(response)).to.not.be.empty
    })

    it('rejects deleteToken for a privileged admin without the token permission', async function () {
        const client = apollo(Cypress.config().baseUrl, ADMIN_NO_TOKEN)
        const response = await client.mutate({
            mutation: GQL_DELETE,
            variables: { tokenKey: 'no-such-key' },
        })
        expect(response.errors, JSON.stringify(response)).to.not.be.empty
    })

    it('still lets a permission holder update and delete their own token', async function () {
        const client = apollo(Cypress.config().baseUrl, HOLDER)
        const name = 'test-perm-' + new Date().getTime()

        await createToken(name, null, null, client)
        const token = await getToken('patTokenHolder', name, client)

        const updated = await client.mutate({
            mutation: GQL_UPDATE,
            variables: { tokenKey: token.key, tokenName: `${name}-upd`, expireAt: null, tokenState: null },
        })
        expect(updated.errors, JSON.stringify(updated)).to.be.undefined

        const deleted = await client.mutate({
            mutation: GQL_DELETE,
            variables: { tokenKey: token.key },
        })
        expect(deleted.errors, JSON.stringify(deleted)).to.be.undefined
    })
})
