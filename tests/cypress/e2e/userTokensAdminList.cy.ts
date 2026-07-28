import { createUser, deleteUser, grantRoles } from '@jahia/cypress'
import { userTokensPage } from '../page-object/userTokens.page'
import { apollo } from '../support/apollo'
import { createToken, deleteToken, getToken, getTokens } from '../support/gql'
import { SERVER_ADMINISTRATOR_ROLE } from '../page-object/rolesAdmin.page'

const USER_PASSWORD = 'password'
const USER_1 = 'tokenUser1'
const USER_2 = 'tokenUser2'
const TOKEN_1_NAME = `${USER_1}-token`
const TOKEN_2_NAME = `${USER_2}-token`

function rootClient() {
    return apollo(Cypress.config().baseUrl, { username: 'root', password: Cypress.env('SUPER_USER_PASSWORD') })
}

describe('UI e2e test - User API Tokens admin list, filter and lifecycle across multiple users', () => {
    let token1Key: string
    let token2Key: string

    before(function () {
        createUser(USER_1, USER_PASSWORD)
        createUser(USER_2, USER_PASSWORD)
        grantRoles('/', [SERVER_ADMINISTRATOR_ROLE.id], USER_1, 'USER')
        grantRoles('/', [SERVER_ADMINISTRATOR_ROLE.id], USER_2, 'USER')
    })

    before(async function () {
        const client = rootClient()

        // Remove any stray tokens (e.g. root's own) so the admin list only ever shows this test's data.
        const existingTokens = await getTokens({ userId: null }, client)
        for (const token of existingTokens.nodes) {
            await deleteToken(token.key, client)
        }

        // Each user creates their own token via the API (self-service permission, granted by setupRoles()).
        const user1Client = apollo(Cypress.config().baseUrl, { username: USER_1, password: USER_PASSWORD })
        const user2Client = apollo(Cypress.config().baseUrl, { username: USER_2, password: USER_PASSWORD })
        await createToken(TOKEN_1_NAME, 'ACTIVE', null, user1Client)
        await createToken(TOKEN_2_NAME, 'ACTIVE', null, user2Client)

        token1Key = (await getToken(USER_1, TOKEN_1_NAME, client)).key
        token2Key = (await getToken(USER_2, TOKEN_2_NAME, client)).key
    })

    after(function () {
        deleteUser(USER_1)
        deleteUser(USER_2)
    })

    it('Lists, filters and manages tokens for multiple users in the admin User API Tokens screen', function () {
        cy.log('root can see both tokens, and only those, in the admin User API Tokens screen')
        cy.login()
        userTokensPage.visit()
        userTokensPage.validateTokenRowCount(2)
        userTokensPage.validateTokenIsVisibleInTheTable(TOKEN_1_NAME)
        userTokensPage.validateTokenIsVisibleInTheTable(TOKEN_2_NAME)
        userTokensPage.validateTokenKeyEquals(TOKEN_1_NAME, token1Key)
        userTokensPage.validateTokenKeyEquals(TOKEN_2_NAME, token2Key)

        cy.log(`Filter by "${USER_1}": only their token is listed`)
        userTokensPage.searchUser(USER_1)
        userTokensPage.validateTokenRowCount(1)
        userTokensPage.validateTokenIsVisibleInTheTable(TOKEN_1_NAME)
        userTokensPage.validateTokenKeyEquals(TOKEN_1_NAME, token1Key)

        cy.log('Disable the filtered token and validate its status')
        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.displayMenuBtn)
        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.activateDeactivateToggle)
        userTokensPage.validateDisabledTokenStatus()

        cy.log('Enable the token back and validate its status')
        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.displayMenuBtn)
        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.activateDeactivateToggle)
        userTokensPage.validateActiveTokenStatus()

        cy.log('Delete the token')
        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.deleteTokenBtn)
        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.acceptDialogBtn)
        userTokensPage.assertElementVisibleBySelector(userTokensPage.elements.noTokensMessage)

        cy.log(`Remove the filter: only ${USER_2}'s token remains`)
        userTokensPage.searchUser()
        userTokensPage.validateTokenRowCount(1)
        userTokensPage.validateTokenIsVisibleInTheTable(TOKEN_2_NAME)
        userTokensPage.validateTokenKeyEquals(TOKEN_2_NAME, token2Key)
        cy.logout()
    })
})
