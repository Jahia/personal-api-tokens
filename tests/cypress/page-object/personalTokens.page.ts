import { BasePage } from './base.page'

class PersonalTokensPage extends BasePage {
    elements = {
        personalTokens: "[data-sel-role*='personal-api-tokens']",
    }

    goTo() {
        cy.goTo('/jahia/dashboard')
        cy.get(this.elements.personalTokens).click()
        return this
    }

    clickOnCreateTokenBtn() {
        this.getByText('button', 'Create Token').click()
    }

    clickOnCreateBtn() {
        this.getByText('button', 'Create').click()
    }
}

export const tokensPage = new PersonalTokensPage()
