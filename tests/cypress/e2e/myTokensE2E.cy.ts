import { tokensPage } from '../page-object/personalTokens.page'
import { apollo } from '../support/apollo'
import { deleteToken, getTokens } from '../support/gql'

const TEST_TOKEN_NAME = 'test-token'

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

    after(async function () {
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

    it('Full lifecycle', function () {
        cy.login()
        tokensPage.visit()
        tokensPage.assertElementVisibleBySelector(tokensPage.elements.noTokensMessage)

        cy.log('Create the first token of the connected user')

        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.createTokenButton)

        tokensPage.assertElementVisibleBySelector(tokensPage.elements.dialogHeader)
        tokensPage.fillTokenName()
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.acceptDialogBtn)

        tokensPage.assertElementVisibleBySelector(tokensPage.elements.dialogHeader)
        tokensPage.storeTokenValueAsAlias('tokenValue')
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.acceptDialogBtn)
        tokensPage.validateTokenIsVisibleInTheTable()

        cy.log('Verify created token')
        cy.get('@tokenValue').then(($tokenValue) => {
            cy.apollo({
                variables: { token: $tokenValue },
                queryFile: 'verifyToken.graphql',
            }).should((reponse) => {
                expect(reponse.data.admin.personalApiTokens.verifyToken).to.equal(true)
            })
        })

        cy.log('disable the token')

        tokensPage.validateActiveTokenStatus()
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.displayMenuBtn)
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.activateDeactivateToggle)
        tokensPage.validateDisabledTokenStatus()

        cy.log('verify disabled token')
        cy.get('@tokenValue').then(($tokenValue) => {
            cy.apollo({
                variables: { token: $tokenValue },
                queryFile: 'verifyToken.graphql',
            }).should((response) => {
                expect(response.data.admin.personalApiTokens.verifyToken).to.equal(false)
            })
        })

        cy.log('Activate the token')

        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.displayMenuBtn)
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.activateDeactivateToggle)
        tokensPage.validateActiveTokenStatus()

        cy.log('Verify activated token')

        cy.get('@tokenValue').then(($tokenValue) => {
            cy.apollo({
                variables: { token: $tokenValue },
                queryFile: 'verifyToken.graphql',
            }).should((response) => {
                expect(response.data.admin.personalApiTokens.verifyToken).to.equal(true)
            })
        })

        cy.log('Delete the token')

        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.deleteTokenBtn)
        tokensPage.assertButtonVisibleAndClick(tokensPage.elements.acceptDialogBtn)
        tokensPage.assertElementVisibleBySelector(tokensPage.elements.noTokensMessage)

        cy.log('Verify deleted token')

        cy.apollo({
            variables: { userId: null },
            queryFile: 'getToken.graphql',
        }).then((response) => {
            const existingTokens = response.data.admin.personalApiTokens.tokens.nodes
            cy.log(JSON.stringify(existingTokens))
            expect(existingTokens.filter((t: { name: string }) => t.name === TEST_TOKEN_NAME).length).to.equal(0)
        })
    })
})
