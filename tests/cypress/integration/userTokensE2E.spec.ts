import { apollo } from '../support/apollo'
import { createToken, deleteToken, getTokens } from '../support/gql'
import { userTokensPage } from '../page-object/userTokens.page'
import { tokensPage } from '../page-object/personalTokens.page'
import { loginPage } from '../page-object/login.page'
import { setupRoles } from './setupRoles'

describe('UI e2e test - Full lifecycle in the User API Tokens section in Administration', () => {
    setupRoles()

    before(async function () {
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        // Using null as userId returns tokens for the currently connected user
        const existingTokens = await getTokens({ userId: null }, client)
        for (const token of existingTokens.nodes) {
            await deleteToken(token.key, client)
        }
    })

    //See: https://docs.cypress.io/api/cypress-api/cookies#Preserve-Once
    beforeEach(() => {
        Cypress.Cookies.preserveOnce('JSESSIONID')
    })

    after(async function () {
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        // Using null as userId returns tokens for the currently connected user
        const existingTokens = await getTokens({ userId: null }, client)
        // cy.log(JSON.stringify(existingTokens));
        for (const token of existingTokens.nodes) {
            await deleteToken(token.key, client)
        }
    })

    it('Navigate to an empty token page', function () {
        cy.visit(Cypress.config().baseUrl + '/jahia/dashboard', { failOnStatusCode: false })
        loginPage.login('root', Cypress.env('SUPER_USER_PASSWORD'), true)
        userTokensPage.visit()
        userTokensPage.assertElementVisibleBySelector(userTokensPage.elements.noTokensMessage)
        userTokensPage.assertElementVisibleBySelector(userTokensPage.elements.searchUserBtn)
        userTokensPage.assertElementVisibleBySelector(userTokensPage.elements.searchUserInput)
    })

    it('Creates sample tokens via the API', async () => {
        const token = await createToken(
            `test-token`,
            'ACTIVE',
            null,
            apollo(Cypress.config().baseUrl, { username: 'root', password: Cypress.env('SUPER_USER_PASSWORD') }),
        )
        cy.log(JSON.stringify(token))
        expect(token).to.have.length.of.at.least(10, 'not a token')
    })

    it('Checks that tokens are present in table', () => {
        cy.reload()
        userTokensPage.visit()
        tokensPage.validateTokenIsVisibleInTheTable()
    })

    it('Displays correct behaviour on search for user', () => {
        userTokensPage.fillUserName('anne')
        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.searchUserBtn)
        userTokensPage.assertElementVisibleBySelector(tokensPage.elements.noTokensMessage)
        cy.get(userTokensPage.elements.searchUserInput).children().last().clear()
        userTokensPage.fillUserName('root')
        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.searchUserBtn)
        tokensPage.validateTokenIsVisibleInTheTable()
    })

    it('Disable the token', function () {
        userTokensPage.validateActiveTokenStatus()
        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.displayMenuBtn)
        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.activateDeactivateToggle)
        userTokensPage.validateDisabledTokenStatus()
    })

    it('Activate the token', function () {
        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.displayMenuBtn)
        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.activateDeactivateToggle)
        userTokensPage.validateActiveTokenStatus()
    })

    it('Delete the token', function () {
        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.deleteTokenBtn)
        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.acceptDialogBtn)
        userTokensPage.getByText('p', this.TEST_TOKEN_NAME).should('not.be.visible')
    })

    it('Verify deleted token', async function () {
        const existingTokens = await getTokens(
            { userId: null },
            apollo(Cypress.config().baseUrl, { username: 'root', password: Cypress.env('SUPER_USER_PASSWORD') }),
        )
        cy.log(JSON.stringify(existingTokens))
        expect(existingTokens.nodes.filter((t: { name: string }) => t.name === this.TEST_TOKEN_NAME).length).to.equal(0)
    })
})
