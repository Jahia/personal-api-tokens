import { tokensPage } from '../page-object/personalTokens.page'
import { apolloClient } from '../support/apollo'
import { deleteToken, getTokens, verifyToken } from '../support/gql'

const PARAGRAPH_ELEMENT = 'p'

const TEST_TOKEN_NAME = 'test-token'
let TEST_TOKEN = ''

describe('UI e2e test - Full lifecycle in the My API Tokens section', () => {
    before(async function () {
        const client = apolloClient()
        // Using null as userId returns tokens for the currently connected user
        const existingTokens = await getTokens({ userId: null }, client)
        for (const token of existingTokens.nodes) {
            await deleteToken(token.key, client)
        }
    })

    it('Navigate to an empty token page', function () {
        tokensPage.goTo()
        tokensPage.validateElementVisible(tokensPage.elements.noTokensMessage)
    })

    it('Create the first token of the connected user', function () {
        tokensPage.validateVisibilityOfButtonAndClick(tokensPage.elements.createTokenButton)

        tokensPage.validateElementVisible(tokensPage.elements.dialogHeader)
        tokensPage.fillTokenName()
        tokensPage.validateVisibilityOfButtonAndClick(tokensPage.elements.acceptDialogBtn)

        tokensPage.validateElementVisible(tokensPage.elements.dialogHeader)
        cy.get(tokensPage.elements.tokenValueParagraph).should(($div) => {
            expect($div.text()).not.to.be.empty
            TEST_TOKEN = $div.text()
        })
        tokensPage.validateVisibilityOfButtonAndClick(tokensPage.elements.closeDialogBtn)
        tokensPage.validateTokenIsVisibleInTheTable()
    })

    it('Verify created token', async function () {
        expect(await verifyToken(TEST_TOKEN, apolloClient())).to.be.true
    })

    it('Disable the token', function () {
        tokensPage.validateActiveTokenStatus()
        tokensPage.validateVisibilityOfButtonAndClick(tokensPage.elements.displayMenuBtn)
        tokensPage.validateVisibilityOfButtonAndClick(tokensPage.elements.activateDeactivateToggle)
        tokensPage.validateDisabledTokenStatus()
    })

    it('Verify disabled token', async function () {
        expect(await verifyToken(TEST_TOKEN, apolloClient())).to.be.false
    })

    it('Activate the token', function () {
        tokensPage.validateVisibilityOfButtonAndClick(tokensPage.elements.displayMenuBtn)
        tokensPage.validateVisibilityOfButtonAndClick(tokensPage.elements.activateDeactivateToggle)
        tokensPage.validateActiveTokenStatus()
    })

    it('Verify activated token', async function () {
        expect(await verifyToken(TEST_TOKEN, apolloClient())).to.be.true
    })

    it('Delete the token', function () {
        tokensPage.validateVisibilityOfButtonAndClick(tokensPage.elements.deleteTokenBtn)
        tokensPage.validateVisibilityOfButtonAndClick(tokensPage.elements.acceptDialogBtn)
        tokensPage.getByText(PARAGRAPH_ELEMENT, TEST_TOKEN_NAME).should('not.be.visible')
    })

    it('Verify deleted token', async function () {
        const existingTokens = await getTokens({ userId: null }, apolloClient())
        cy.log(JSON.stringify(existingTokens))
        expect(existingTokens.nodes.filter((t: { name: string }) => t.name === TEST_TOKEN_NAME).length).to.equal(0)
    })

    after(async function () {
        const client = apolloClient()
        // Using null as userId returns tokens for the currently connected user
        const existingTokens = await getTokens({ userId: null }, client)
        // cy.log(JSON.stringify(existingTokens));
        for (const token of existingTokens.nodes) {
            await deleteToken(token.key, client)
        }
    })
})
