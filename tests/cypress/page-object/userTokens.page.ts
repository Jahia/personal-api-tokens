import { BasePage } from './base.page'

class UserTokensPage extends BasePage {
    TEST_TOKEN_NAME = 'test-token'

    elements = {
        userTokens: "[data-sel-role*='pat']",
        manageUsers: "[data-sel-role*='manageUsers']",

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

    clearUserNameFilter() {
        cy.get(this.elements.searchUserInput).children().last().clear()
        return this
    }

    // Clears any existing filter, then searches by username; pass '' (or omit) to remove the filter.
    searchUser(name = '') {
        this.clearUserNameFilter()
        if (name) {
            this.fillUserName(name)
        }

        this.assertButtonVisibleAndClick(this.elements.searchUserBtn)
        return this
    }

    validateTokenIsVisibleInTheTable(tokenName: string = this.TEST_TOKEN_NAME) {
        this.getByText('p', tokenName).should(this.BE_VISIBLE)
    }

    // The key column is the cell immediately following the token name column in the table row.
    private getTokenKeyCell(tokenName: string): Cypress.Chainable {
        return this.getByText('td', tokenName).next()
    }

    validateTokenKeyEquals(tokenName: string, expectedKey: string) {
        this.getTokenKeyCell(tokenName).invoke('text').should('eq', expectedKey)
    }

    validateTokenRowCount(count: number) {
        cy.get('table tbody tr').should('have.length', count)
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
