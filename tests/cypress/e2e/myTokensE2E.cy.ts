import { tokensPage } from '../page-object/personalTokens.page'
import { loginPage } from '../page-object/login.page'
import { apollo } from '../support/apollo'
import { deleteToken, getTokens, verifyToken } from '../support/gql'

const TEST_TOKEN_NAME = 'test-token'
let TEST_TOKEN = ''

describe('UI e2e test - Full lifecycle in the My API Tokens section', () => {
    before(async () => {
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

    // See: https://docs.cypress.io/api/cypress-api/cookies#Preserve-Once
    // beforeEach(() => {
    //     Cypress.Cookies.preserveOnce('JSESSIONID')
    // })

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
        tokensPage.visit()
        tokensPage.assertElementVisibleBySelector(tokensPage.elements.noTokensMessage)
    })

    it('Create the first token of the connected user', function () {
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.createTokenButton)

        tokensPage.assertElementVisibleBySelector(tokensPage.elements.dialogHeader)
        tokensPage.fillTokenName()
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.acceptDialogBtn)

        tokensPage.assertElementVisibleBySelector(tokensPage.elements.dialogHeader)
        cy.get(tokensPage.elements.tokenValueParagraph).should(($div) => {
            expect($div.text()).not.to.be.empty
            TEST_TOKEN = $div.text()
        })
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.acceptDialogBtn)
        tokensPage.validateTokenIsVisibleInTheTable()
    })

    it('Verify created token', async function () {
        expect(
            await verifyToken(
                TEST_TOKEN,
                apollo(Cypress.config().baseUrl, { username: 'root', password: Cypress.env('SUPER_USER_PASSWORD') }),
            ),
        ).to.be.true
    })

    it('Disable the token', function () {
        tokensPage.validateActiveTokenStatus()
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.displayMenuBtn)
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.activateDeactivateToggle)
        tokensPage.validateDisabledTokenStatus()
    })

    it('Verify disabled token', async function () {
        expect(
            await verifyToken(
                TEST_TOKEN,
                apollo(Cypress.config().baseUrl, { username: 'root', password: Cypress.env('SUPER_USER_PASSWORD') }),
            ),
        ).to.be.false
    })

    it('Activate the token', function () {
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.displayMenuBtn)
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.activateDeactivateToggle)
        tokensPage.validateActiveTokenStatus()
    })

    it('Verify activated token', async function () {
        expect(
            await verifyToken(
                TEST_TOKEN,
                apollo(Cypress.config().baseUrl, { username: 'root', password: Cypress.env('SUPER_USER_PASSWORD') }),
            ),
        ).to.be.true
    })

    it('Delete the token', function () {
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.deleteTokenBtn)
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.acceptDialogBtn)
        tokensPage.assertElementVisibleBySelector(tokensPage.elements.noTokensMessage)
    })

    it('Verify deleted token', async function () {
        const existingTokens = await getTokens(
            { userId: null },
            apollo(Cypress.config().baseUrl, { username: 'root', password: Cypress.env('SUPER_USER_PASSWORD') }),
        )
        cy.log(JSON.stringify(existingTokens))
        expect(existingTokens.nodes.filter((t: { name: string }) => t.name === TEST_TOKEN_NAME).length).to.equal(0)
    })
})
