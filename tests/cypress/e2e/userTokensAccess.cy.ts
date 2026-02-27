import { createUser, deleteUser, grantRoles } from '@jahia/cypress'
import { setupRoles } from './setupRoles'

describe('UI permission test - Access to the User API Tokens section in Administration', () => {
    before(function () {
        createUser('penny', 'penny1234')
        createUser('leonard', 'leonard1234')
        grantRoles('/', ['admin-token'], 'penny', 'USER')
        grantRoles('/', ['admin-no-token'], 'leonard', 'USER')
    })

    after(function () {
        // deleteUser('penny')
        // deleteUser('leonard')
    })

    it('Check access to admin users token page is possible (penny)', function () {
        cy.login('penny', 'penny1234')
        cy.visit(Cypress.config().baseUrl + '/jahia/administration/manageUsers', { failOnStatusCode: false })
        cy.get("[data-sel-role*='manageUsers']").should('exist')
        cy.get("[data-sel-role*='pat']").should('exist')
        cy.logout()
    })

    it('Check access to admin users token page is not possible (leonard)', function () {
        cy.login('leonard', 'leonard1234')
        cy.visit(Cypress.config().baseUrl + '/jahia/administration/manageUsers', { failOnStatusCode: false })
        cy.get("[data-sel-role*='manageUsers']").should('exist')
        cy.get("[data-sel-role*='pat']").should('not.exist')
        cy.logout()
    })
})
