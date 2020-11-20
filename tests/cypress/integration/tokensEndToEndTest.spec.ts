import { tokensPage } from '../page-object/personalTokens.page'
import { apolloClient } from '../support/apollo'
import { deleteToken, getTokens } from '../support/gql'

const SPAN_ELEMENT = 'span'
const BUTTON_ELEMENT = 'button'
const PARAGRAPH_ELEMENT = 'p'

const EXIST_MATCHER = 'exist'

const DELETE_BUTTON_SELECTOR = 'tbody tr:last td:last div button:first'
const MENU_BUTTON_SELECTOR = 'tbody tr:last td:last div button:last'

const NO_TOKENS = "You don't have any personal access tokens yet"

function createTestToken() {
    tokensPage.clickOnCreateTokenBtn()
    expect(tokensPage.getByText(PARAGRAPH_ELEMENT, 'Create a personal API token')).not.to.be.undefined
    cy.get('input[type=text]').first().type('test-token')
    expect(tokensPage.getByText(BUTTON_ELEMENT, /^Create$/)).not.to.be.undefined
    tokensPage.clickOnCreateBtn()
    expect(tokensPage.getByText(PARAGRAPH_ELEMENT, 'Access token created')).not.to.be.undefined
    tokensPage.getByText(BUTTON_ELEMENT, 'Close').click()
}

function deleteTestToken() {
    cy.get('table').find(DELETE_BUTTON_SELECTOR).click()
    tokensPage.getByText(BUTTON_ELEMENT, /^Delete forever$/).click()
}

function deactivateTestToken() {
    tokensPage.getByText(SPAN_ELEMENT, 'ACTIVE').should(EXIST_MATCHER)
    tokensPage.getByText(SPAN_ELEMENT, 'Deactivate').click()
    tokensPage.getByText(SPAN_ELEMENT, 'DISABLED').should(EXIST_MATCHER)
}

function activateTestToken() {
    tokensPage.getByText(SPAN_ELEMENT, 'Activate').click()
    tokensPage.getByText(SPAN_ELEMENT, 'ACTIVE').should(EXIST_MATCHER)
}

describe('Successfully navigates to token app', () => {
    beforeEach(async function () {
        const client = apolloClient()
        return Promise.all(
            (await getTokens({ userId: 'root' }, client)).nodes
                .filter((token) => token.name.startsWith('test-'))
                .map((token) => deleteToken(token.key, client)),
        )
    })
    it('successfully goes to token app through dashboard menu and finds create token button', function () {
        tokensPage.goTo()
        tokensPage.getByText(BUTTON_ELEMENT, 'Create Token').should(EXIST_MATCHER)
        tokensPage.getByText(PARAGRAPH_ELEMENT, NO_TOKENS).should(EXIST_MATCHER)
        createTestToken()
        deleteTestToken()
        tokensPage.getByText(PARAGRAPH_ELEMENT, NO_TOKENS).should(EXIST_MATCHER)
        createTestToken()
        cy.get('table').find(MENU_BUTTON_SELECTOR).click()
        deactivateTestToken()
        cy.get('table').find(MENU_BUTTON_SELECTOR).click()
        activateTestToken()
    })
    afterEach(async function () {
        const client = apolloClient()
        return Promise.all(
            (await getTokens({ userId: 'root' }, client)).nodes
                .filter((token) => token.name.startsWith('test-'))
                .map((token) => deleteToken(token.key, client)),
        )
    })
})
