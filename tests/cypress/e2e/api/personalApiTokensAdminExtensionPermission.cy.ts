import { apollo } from '../../support/apollo'
import { DocumentNode } from 'graphql'

import { createToken, getToken } from '../../support/gql'

// Regression: the `personalApiTokens` field contributed to the admin mutation type
// must require the `personal-api-tokens` permission, so the whole token-mutation
// subtree is consistently gated at its entry point. A privileged administrator who
// does not hold that permission must be refused at the `admin.personalApiTokens`
// entry, while a permission holder reaches it normally.
// Fully self-contained (CI-ready): a groovy fixture provisions its own roles + users
// in before() and removes them in after().
describe('Personal API token admin mutation extension - entry permission', () => {
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

    it('refuses the personalApiTokens entry for a privileged admin without the token permission', async function () {
        const client = apollo(Cypress.config().baseUrl, ADMIN_NO_TOKEN)
        const response = await client.mutate({
            mutation: GQL_UPDATE,
            variables: { tokenKey: 'no-such-key', tokenName: 'x', expireAt: null, tokenState: null },
        })
        // The refusal happens at the admin.personalApiTokens entry, before any token operation runs.
        expect(response.errors, JSON.stringify(response)).to.not.be.empty
        expect(JSON.stringify(response.errors)).to.contain('personalApiTokens')
    })

    it('still lets a permission holder reach the entry and manage their own token', async function () {
        const client = apollo(Cypress.config().baseUrl, HOLDER)
        const name = 'test-entry-' + new Date().getTime()

        await createToken(name, null, null, client)
        const token = await getToken('patTokenHolder', name, client)

        const deleted = await client.mutate({
            mutation: GQL_DELETE,
            variables: { tokenKey: token.key },
        })
        expect(deleted.errors, JSON.stringify(deleted)).to.be.undefined
    })
})
