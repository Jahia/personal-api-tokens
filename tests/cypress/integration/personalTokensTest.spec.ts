import { tokensPage } from '../page-object/personalTokens.page'

describe('Successfully navigates to token app', () => {
    it('successfully goes to token app through dashboard menu and finds create token button', function () {
        tokensPage.goTo()
        expect(tokensPage.getByText('button', 'Create Token')).not.to.be.undefined
    })
})
