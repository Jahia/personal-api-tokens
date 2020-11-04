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
}

export const tokensPage = new PersonalTokensPage()
