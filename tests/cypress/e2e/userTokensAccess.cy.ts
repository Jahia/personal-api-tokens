import { createUser, deleteUser, grantRoles, revokeRoles } from '@jahia/cypress'
import { tokensPage } from '../page-object/personalTokens.page'
import { userTokensPage } from '../page-object/userTokens.page'
import {
    rolesAdminPage,
    SERVER_ADMINISTRATOR_ROLE,
    PERMISSION_GROUPS,
    PERMISSION_PATHS,
} from '../page-object/rolesAdmin.page'
import { revokeRolePermission } from '../support/roles'

const TEST_USER_ID = 'irina'
const TEST_USER_PASSWORD = 'password'
const USER_ADM_TOKEN = 'penny'
const USER_ADM_NO_TOKEN = 'leonard'

const assertDashboardEntry = (shouldExist: boolean) => {
    cy.visit(Cypress.config().baseUrl + '/jahia/dashboard', { failOnStatusCode: false })
    cy.get(tokensPage.elements.personalTokens).should(shouldExist ? 'exist' : 'not.exist')
}

const assertAdminEntry = (shouldUserTokensExist: boolean, shouldManageUsersExist: boolean) => {
    cy.visit(Cypress.config().baseUrl + '/jahia/administration/manageUsers', { failOnStatusCode: false })
    cy.get(userTokensPage.elements.userTokens).should(shouldUserTokensExist ? 'exist' : 'not.exist')
    cy.get(userTokensPage.elements.manageUsers).should(shouldManageUsersExist ? 'exist' : 'not.exist')
}

describe('UI permission test - Progressive access to Personal API Tokens via the server-administrator role', () => {
    before(function () {
        createUser(USER_ADM_TOKEN, TEST_USER_PASSWORD)
        createUser(USER_ADM_NO_TOKEN, TEST_USER_PASSWORD)
        grantRoles('/', ['admin-token'], USER_ADM_TOKEN, 'USER')
        grantRoles('/', ['admin-no-token'], USER_ADM_NO_TOKEN, 'USER')
    })

    beforeEach(function () {
        // The legacy "Roles and permissions" screen briefly navigates through a "#" URL before
        // its real webflow URL loads, which can throw an unrelated "$ is not defined" error from
        // the app's error page script during that transition. It doesn't affect the actual test.
        cy.on('uncaught:exception', () => false)
    })

    after(function () {
        cy.log(
            `Cleanup: restore server-administrator permissions and remove ${TEST_USER_ID} from the role (via backend API)`,
        )
        revokeRolePermission(SERVER_ADMINISTRATOR_ROLE.path, 'personal-api-tokens')
        revokeRoles('/', ['server-administrator'], TEST_USER_ID, 'USER')

        cy.log('Cleanup: delete other test users')
        deleteUser(USER_ADM_TOKEN)
        deleteUser(USER_ADM_NO_TOKEN)
    })

    it(`Check access to admin users token page is possible (${USER_ADM_TOKEN})`, function () {
        cy.login(USER_ADM_TOKEN, TEST_USER_PASSWORD)
        assertAdminEntry(true, true)
        cy.logout()
    })

    it(`Check access to admin users token page is not possible (${USER_ADM_NO_TOKEN})`, function () {
        cy.login(USER_ADM_NO_TOKEN, TEST_USER_PASSWORD)
        assertAdminEntry(false, true)
        cy.logout()
    })

    it(`Reflects server-administrator role permission changes on Personal API Tokens access (${TEST_USER_ID})`, function () {
        cy.log(`1. root adds ${TEST_USER_ID} as server administrator (Administration > Users and Roles > Server roles)`)
        cy.login()
        rolesAdminPage.setServerRoleMember(SERVER_ADMINISTRATOR_ROLE.id, TEST_USER_ID, true)
        cy.logout()

        cy.log(
            `${TEST_USER_ID} is server administrator: no My Tokens entry, but User API Tokens admin entry is present`,
        )
        cy.login(TEST_USER_ID, TEST_USER_PASSWORD)
        assertDashboardEntry(false)
        assertAdminEntry(true, true)
        cy.logout()

        cy.log('2. root unchecks "Admin personal api tokens" (server administration / Admin) on server-administrator')
        cy.login()
        rolesAdminPage.updateRolePermission(
            SERVER_ADMINISTRATOR_ROLE.label,
            PERMISSION_GROUPS.serverAdmin,
            PERMISSION_PATHS.ADMIN_PERSONAL_API_TOKENS,
            false,
        )
        cy.logout()

        cy.log(`3. ${TEST_USER_ID} now has neither the My Tokens entry nor the User API Tokens admin entry`)
        cy.login(TEST_USER_ID, TEST_USER_PASSWORD)
        assertDashboardEntry(false)
        assertAdminEntry(false, true)
        cy.logout()

        cy.log('4. root checks "Personal api tokens" (other permission / developer tools) on server-administrator')
        cy.login()
        rolesAdminPage.updateRolePermission(
            SERVER_ADMINISTRATOR_ROLE.label,
            PERMISSION_GROUPS.other,
            PERMISSION_PATHS.PERSONAL_API_TOKENS,
            true,
        )
        cy.logout()

        cy.log(`5. ${TEST_USER_ID} now has the My Tokens entry but still no User API Tokens admin entry`)
        cy.login(TEST_USER_ID, TEST_USER_PASSWORD)
        assertDashboardEntry(true)
        assertAdminEntry(false, true)
        cy.logout()

        cy.log('6. root re-checks "Admin personal api tokens" (server administration / Admin) on server-administrator')
        cy.login()
        rolesAdminPage.updateRolePermission(
            SERVER_ADMINISTRATOR_ROLE.label,
            PERMISSION_GROUPS.serverAdmin,
            PERMISSION_PATHS.ADMIN_PERSONAL_API_TOKENS,
            true,
        )
        cy.logout()

        cy.log(`7. ${TEST_USER_ID} now has both the My Tokens entry and the User API Tokens admin entry`)
        cy.login(TEST_USER_ID, TEST_USER_PASSWORD)
        assertDashboardEntry(true)
        assertAdminEntry(true, true)
        cy.logout()
    })
})
