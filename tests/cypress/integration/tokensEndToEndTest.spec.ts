import { tokensPage } from '../page-object/personalTokens.page'
import { apolloClient } from '../support/apollo'
import { deleteToken, getTokens, verifyToken } from '../support/gql'

const SPAN_ELEMENT = 'span'
const BUTTON_ELEMENT = 'button'
const PARAGRAPH_ELEMENT = 'p'

const EXIST_MATCHER = 'exist'

const DELETE_BUTTON_SELECTOR = 'tbody tr:last td:last div button:first'
const MENU_BUTTON_SELECTOR = 'tbody tr:last td:last div button:last'

const NO_TOKENS = "You don't have any personal access tokens yet"
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
        tokensPage.getByText(BUTTON_ELEMENT, 'Create Token').should(EXIST_MATCHER)
        tokensPage.getByText(PARAGRAPH_ELEMENT, NO_TOKENS).should(EXIST_MATCHER)
    })

    it('Create the first token of the connected user', function () {
        tokensPage.clickOnCreateTokenBtn()
        expect(tokensPage.getByText(PARAGRAPH_ELEMENT, 'Create a personal API token')).not.to.be.undefined
        cy.get('input[type=text]').first().type(TEST_TOKEN_NAME)
        expect(tokensPage.getByText(BUTTON_ELEMENT, /^Create$/)).not.to.be.undefined
        tokensPage.clickOnCreateBtn()
        expect(tokensPage.getByText(PARAGRAPH_ELEMENT, 'Access token created')).not.to.be.undefined

        tokensPage
            .getByText('p', 'This is the only time token can be viewed. You will not be able to recover it')
            .parent()
            .children()
            .last()
            .children()
            .last()
            .should(($div) => {
                const text = $div.text()
                expect(text).not.to.eql('')
                TEST_TOKEN = text
            })
        tokensPage.getByText(BUTTON_ELEMENT, 'Close').click()
        tokensPage.getByText(PARAGRAPH_ELEMENT, TEST_TOKEN_NAME).should('be.visible')
    })

    // it('Find Token in a list of many tokens', function () {
    //     [...Array(2)].forEach((_, i) => {
    //         createToken('ui-e2e-' + i, null, null, apolloClient())
    //     })
    // })

    it('Verify created token', async function () {
        expect(await verifyToken(TEST_TOKEN, apolloClient())).to.be.true
    })

    it('Disable the token', function () {
        cy.get('table').find(MENU_BUTTON_SELECTOR).click()
        tokensPage.getByText(SPAN_ELEMENT, 'ACTIVE').should(EXIST_MATCHER)
        tokensPage.getByText(SPAN_ELEMENT, 'Deactivate').click()
        tokensPage.getByText(SPAN_ELEMENT, 'DISABLED').should(EXIST_MATCHER)
    })

    it('Verify disabled token', async function () {
        expect(await verifyToken(TEST_TOKEN, apolloClient())).to.be.false
    })

    it('Activate the token', function () {
        cy.get('table').find(MENU_BUTTON_SELECTOR).click()
        tokensPage.getByText(SPAN_ELEMENT, 'Activate').click()
        tokensPage.getByText(SPAN_ELEMENT, 'ACTIVE').should(EXIST_MATCHER)
    })

    it('Verify activated token', async function () {
        expect(await verifyToken(TEST_TOKEN, apolloClient())).to.be.true
    })

    it('Delete the token', function () {
        cy.get('table').find(DELETE_BUTTON_SELECTOR).click()
        tokensPage.getByText(BUTTON_ELEMENT, /^Delete forever$/).click()
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
