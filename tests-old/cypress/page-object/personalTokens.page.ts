import { BasePage } from './base.page'

class PersonalTokensPage extends BasePage {
    private TEST_TOKEN_NAME = 'test-token'

    elements = {
        personalTokens: "[data-sel-role*='personal-api-tokens']",

        createTokenButton: "[data-testid*='create-token-btn']",
        noTokensMessage: "[data-testid*='no-tokens-message']",

        tokenNameInput: "[data-testid*='token-name-input']",
        tokenValueParagraph: "[data-testid*='token-value']",

        acceptDialogBtn: "[data-testid*='accept-dialog-btn']",
        closeDialogBtn: "[data-testid*='close-dialog-btn']",
        dialogHeader: "[data-testid*='dialog-header']",

        tokenStatusChip: "[data-testid*='token-status-chip']",
        deleteTokenBtn: "[data-testid*='delete-token-btn']",
        displayMenuBtn: "[data-testid*='display-menu-btn']",
        activateDeactivateToggle: "[data-testid*='activate-deactivate-toggle-btn']",
    }

    goTo() {
        cy.goTo('/jahia/dashboard')
        cy.get(this.elements.personalTokens).click()
        return this
    }

    fillTokenName() {
        cy.get(this.elements.tokenNameInput).type(this.TEST_TOKEN_NAME)
    }

    validateTokenIsVisibleInTheTable() {
        tokensPage.getByText('p', this.TEST_TOKEN_NAME).should(this.BE_VISIBLE)
    }

    validateActiveTokenStatus() {
        cy.get(this.elements.tokenStatusChip).should(($div) => {
            expect($div.text()).to.eql('Active')
        })
    }

    validateDisabledTokenStatus() {
        cy.get(this.elements.tokenStatusChip).should(($div) => {
            expect($div.text()).to.eql('Disabled')
        })
    }
}

export const tokensPage = new PersonalTokensPage()
