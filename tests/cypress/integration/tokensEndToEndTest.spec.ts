import { tokensPage } from '../page-object/personalTokens.page'

describe('Successfully navigates to token app', () => {
    it('successfully goes to token app through dashboard menu and finds create token button', function () {
        tokensPage.goTo()
        expect(tokensPage.getByText('button', 'Create Token')).not.to.be.undefined
        tokensPage.clickOnCreateTokenBtn()
        expect(tokensPage.getByText('p', 'Create a personal API token')).not.to.be.undefined
        cy.get('input[type=text]').first().type('Antonio')
        expect(tokensPage.getByText('button', 'Create')).not.to.be.undefined
        tokensPage.clickOnCreateBtn()
        expect(tokensPage.getByText('p', 'Access token created')).not.to.be.undefined
        tokensPage.getByText('button', 'Close').click()
    })
})
