import { BasePage } from './base.page'

class UserTokensPage extends BasePage {
    TEST_TOKEN_NAME = 'test-token'

    elements = {
        userTokens: "[data-sel-role*='pat']",

        searchUserBtn: "[data-testid*='search-user-btn']",
        noTokensMessage: "[data-testid*='no-tokens-message']",
        searchUserInput: "[data-testid*='search-user-input']",

        acceptDialogBtn: "[data-testid*='accept-dialog-btn']",
        closeDialogBtn: "[data-testid*='close-dialog-btn']",
        dialogHeader: "[data-testid*='dialog-header']",

        tokenStatusChip: "[data-testid*='token-status-chip']",
        deleteTokenBtn: "[data-testid*='delete-token-btn']",
        displayMenuBtn: "[data-testid*='display-menu-btn']",
        activateDeactivateToggle: "[data-testid*='activate-deactivate-toggle-btn']",
    }

    visit() {
        cy.visit('/jahia/administration/manageUsers', { failOnStatusCode: false })
        cy.get(this.elements.userTokens).click()
        return this
    }

    fillUserName(name: string) {
        cy.get(this.elements.searchUserInput).type(name)
    }

    validateTokenIsVisibleInTheTable() {
        this.getByText('p', this.TEST_TOKEN_NAME).should(this.BE_VISIBLE)
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

export const userTokensPage = new UserTokensPage()
