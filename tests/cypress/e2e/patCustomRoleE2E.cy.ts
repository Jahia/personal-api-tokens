import { revokeRoles } from '@jahia/cypress'
import { tokensPage } from '../page-object/personalTokens.page'
import {
    rolesAdminPage,
    PERMISSION_GROUPS,
    PERMISSION_PATHS,
    PERSONAL_API_TOKEN_USER_ROLE,
} from '../page-object/rolesAdmin.page'
import { deleteRole } from '../support/roles'
import { updateToken, deleteAllTokens } from '../support/gql'
import { apollo } from '../support/apollo'

const TEST_USER = 'mathias'
const TEST_USER_PASSWORD = 'password'
const TOKEN_SCOPE = 'graphql'
const SITE_PATH = '/sites/digitall'

const rootClient = () =>
    apollo(Cypress.config().baseUrl, { username: 'root', password: Cypress.env('SUPER_USER_PASSWORD') })

// Exercises the token exactly like an external client would: a plain curl call against the
// GraphQL endpoint with the token in the Authorization header, no Cypress/browser session involved.
function curlValidateToken(token: string) {
    const baseUrl = Cypress.config().baseUrl
    const query =
        'query nodeByPath($path: String!) { jcr(workspace: EDIT) { nodeByPath(path: $path) { uuid name primaryNodeType { name } } } }'
    const body = JSON.stringify({ query, variables: { path: SITE_PATH } })
    const command = [
        'curl -s',
        `--location --request POST '${baseUrl}/modules/graphql'`,
        `--header 'Origin: ${baseUrl}'`,
        `--header 'Referer: ${baseUrl}'`,
        `--header 'Authorization: APIToken ${token}'`,
        `--header 'Content-Type: application/json'`,
        `--data '${body}'`,
    ].join(' ')
    return cy.exec(command, { failOnNonZeroExit: false }).then(({ stdout }) => JSON.parse(stdout))
}

function assertTokenGrantsAccess(token: string) {
    curlValidateToken(token).then((response) => {
        expect(response.errors, JSON.stringify(response)).to.be.undefined
        expect(response.data.jcr.nodeByPath.name).to.equal('digitall')
    })
}

function assertTokenIsRejected(token: string) {
    curlValidateToken(token).then((response) => {
        expect(response.data, JSON.stringify(response)).to.be.null
        expect(response.errors[0].extensions.classification).to.equal('GqlAccessDeniedException')
    })
}

describe('UI e2e test - custom server role grants Personal API Tokens access, then the full token lifecycle', () => {
    before(async function () {
        await deleteAllTokens(TEST_USER, rootClient())
    })

    after(function () {
        cy.log(`Cleanup: remove ${TEST_USER} from the role, delete the custom role`)
        revokeRoles('/', [PERSONAL_API_TOKEN_USER_ROLE.id], TEST_USER, 'USER')
        deleteRole(PERSONAL_API_TOKEN_USER_ROLE.path)
    })

    // Kept as its own hook (rather than folded into the one above): that hook enqueues Cypress
    // commands (revokeRoles/deleteRole) without awaiting them, relying on Cypress's own command
    // queue; mixing that with awaited native promises (deleteAllTokens) in the same hook body is
    // a known Cypress footgun where the two can settle out of order.
    after(async function () {
        await deleteAllTokens(TEST_USER, rootClient())
    })

    it('Full lifecycle: create role & permission, assign user, then create/use/disable/enable/expire/delete a token', function () {
        cy.log('1. root creates a new server role "personal api token user" (Administration > Roles and permissions)')
        cy.login()
        rolesAdminPage.createRole('Server roles', 'personal api token user')

        cy.log('2. root grants it the "Personal api tokens" permission (other permissions / developer tools)')
        rolesAdminPage.updateRolePermission(
            PERSONAL_API_TOKEN_USER_ROLE.label,
            PERMISSION_GROUPS.other,
            PERMISSION_PATHS.PERSONAL_API_TOKENS,
            true,
        )

        cy.log(
            `3. root adds ${TEST_USER} as a member of the new role (Administration > Users and Roles > Server roles)`,
        )
        rolesAdminPage.setServerRoleMember(PERSONAL_API_TOKEN_USER_ROLE.id, TEST_USER, true)
        cy.logout()

        cy.log(`4. ${TEST_USER} logs in: the dashboard shows a Personal API Tokens entry`)
        cy.login(TEST_USER, TEST_USER_PASSWORD)
        cy.visit(Cypress.config().baseUrl + '/jahia/dashboard', { failOnStatusCode: false })
        cy.get(tokensPage.elements.personalTokens).should('be.visible')

        cy.log('5. the Personal API Tokens page opens without error')
        cy.get(tokensPage.elements.personalTokens).click()
        tokensPage.assertElementVisibleBySelector(tokensPage.elements.noTokensMessage)

        cy.log(`6. ${TEST_USER} creates a new token on the "${TOKEN_SCOPE}" scope`)
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.createTokenButton)
        tokensPage.assertElementVisibleBySelector(tokensPage.elements.dialogHeader)
        tokensPage.fillTokenName()
        tokensPage.selectScope(TOKEN_SCOPE)
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.acceptDialogBtn)

        cy.log('7. a copy-to-clipboard button is displayed; clicking it copies the token')
        // The button uses the `copy-to-clipboard` library's document.execCommand('copy') fallback
        // (confirmed from its source), a legacy API that predates the Permissions API entirely -
        // no Browser.grantPermissions grant affects it. Under automation, Chrome's real
        // execCommand('copy') can pop a native, blocking "press Ctrl+C" confirmation dialog for it
        // instead of just copying, which no page/browser permission can suppress. Stubbing
        // execCommand intercepts the call before Chrome's real implementation ever runs, so that
        // dialog never fires, while still proving the button attempts the copy. Token-value
        // correctness itself is already proven by step 8's successful curl call with the
        // page-displayed value captured below.
        tokensPage.assertElementVisibleBySelector(tokensPage.elements.dialogHeader)
        tokensPage.storeTokenValueAsAlias('tokenValue')
        cy.window().then((win) => cy.stub(win.document, 'execCommand').as('execCommand').returns(true))
        tokensPage.getByText('button', 'Copy').should('be.visible').click()
        cy.get('@execCommand').should('have.been.calledWith', 'copy')
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.acceptDialogBtn)
        tokensPage.validateTokenIsVisibleInTheTable()
        tokensPage.storeTokenKeyAsAlias('tokenKey')

        cy.log('8. use the token via curl: the API responds with valid data')
        cy.get('@tokenValue').then(($tokenValue) => assertTokenGrantsAccess($tokenValue as string))

        cy.log('9. disable the token: the API now responds with an error')
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.displayMenuBtn)
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.activateDeactivateToggle)
        tokensPage.validateDisabledTokenStatus()
        cy.get('@tokenValue').then(($tokenValue) => assertTokenIsRejected($tokenValue as string))

        cy.log('10. re-enable the token: the API responds with valid data again')
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.displayMenuBtn)
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.activateDeactivateToggle)
        tokensPage.validateActiveTokenStatus()
        cy.get('@tokenValue').then(($tokenValue) => assertTokenGrantsAccess($tokenValue as string))

        cy.log('11. root sets the expiration date in the past (via GraphQL): the API now responds with an error')
        cy.get('@tokenKey')
            .then(($tokenKey) => {
                const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
                return updateToken($tokenKey as string, null, null, pastDate, rootClient())
            })
            .should('eq', true)
        cy.get('@tokenValue').then(($tokenValue) => assertTokenIsRejected($tokenValue as string))

        cy.log('12. root sets the expiration date in the future (via GraphQL): the API responds with valid data again')
        cy.get('@tokenKey')
            .then(($tokenKey) => {
                const futureDate = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString()
                return updateToken($tokenKey as string, null, null, futureDate, rootClient())
            })
            .should('eq', true)
        cy.get('@tokenValue').then(($tokenValue) => assertTokenGrantsAccess($tokenValue as string))

        cy.log('13. delete the token: it is removed from the list')
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.deleteTokenBtn)
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.acceptDialogBtn)
        tokensPage.assertElementVisibleBySelector(tokensPage.elements.noTokensMessage)
    })
})
