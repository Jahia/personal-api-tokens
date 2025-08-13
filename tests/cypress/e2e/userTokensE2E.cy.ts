import { apollo } from '../support/apollo'
import { deleteToken, getTokens } from '../support/gql'
import { userTokensPage } from '../page-object/userTokens.page'
import { tokensPage } from '../page-object/personalTokens.page'

describe('UI e2e test - Full lifecycle in the User API Tokens section in Administration', () => {
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

    it('Full lifecycle', function () {
        cy.log('Navigate to an empty token page')

        cy.login()
        userTokensPage.visit()
        userTokensPage.assertElementVisibleBySelector(userTokensPage.elements.noTokensMessage)
        userTokensPage.assertElementVisibleBySelector(userTokensPage.elements.searchUserBtn)
        userTokensPage.assertElementVisibleBySelector(userTokensPage.elements.searchUserInput)

        cy.log('Creates sample tokens via the API')

        cy.apollo({
            variables: {
                tokenName: 'test-token',
                tokenState: 'ACTIVE',
            },
            queryFile: 'createToken.graphql',
        }).then((response) => {
            const token = response.data.admin.personalApiTokens.createToken
            cy.log(JSON.stringify(token))
            expect(token).to.have.length.of.at.least(10, 'not a token')
        })

        cy.log('Checks that tokens are present in table')
        cy.reload()
        userTokensPage.visit()
        tokensPage.validateTokenIsVisibleInTheTable()

        cy.log('Displays correct behaviour on search for user')

        userTokensPage.fillUserName('anne')
        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.searchUserBtn)
        userTokensPage.assertElementVisibleBySelector(tokensPage.elements.noTokensMessage)
        cy.get(userTokensPage.elements.searchUserInput).children().last().clear()
        userTokensPage.fillUserName('root')
        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.searchUserBtn)
        tokensPage.validateTokenIsVisibleInTheTable()

        cy.log('Disable the token')

        userTokensPage.validateActiveTokenStatus()
        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.displayMenuBtn)
        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.activateDeactivateToggle)
        userTokensPage.validateDisabledTokenStatus()

        cy.log('Activate the token')

        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.displayMenuBtn)
        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.activateDeactivateToggle)
        userTokensPage.validateActiveTokenStatus()

        cy.log('Delete the token')

        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.deleteTokenBtn)
        userTokensPage.assertButtonVisibleAndClick(userTokensPage.elements.acceptDialogBtn)
        userTokensPage.getByText('p', this.TEST_TOKEN_NAME).should('not.be.visible')

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
