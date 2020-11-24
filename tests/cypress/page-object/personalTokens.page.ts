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

    getTableRowByTokenName(testTokenName: string) {
        const regex = new RegExp(testTokenName)
        return this.getByText('p', regex).parent().parent()
    }

    clickOnCreateBtn() {
        this.getByText('button', /^Create$/).click()
    }
}

export const tokensPage = new PersonalTokensPage()
