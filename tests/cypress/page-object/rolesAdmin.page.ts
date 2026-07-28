import { BasePage } from './base.page'

export const PERMISSION_GROUPS = { serverAdmin: 'serverAdmin', other: 'other' }

export const PERMISSION_PATHS = {
    ADMIN_PERSONAL_API_TOKENS: '/permissions/admin/admin-personal-api-tokens',
    PERSONAL_API_TOKENS: '/permissions/developerTools/personal-api-tokens',
}

export const SERVER_ADMINISTRATOR_ROLE = {
    id: 'server-administrator',
    label: 'Server administrator',
    path: '/roles/server-administrator',
}

// These are the legacy JSP/webflow-based "Server roles" and "Roles and permissions" admin
// screens. They are normally embedded in an iframe under /jahia/administration/..., but they
// are fully functional visited directly, which avoids having to reach into an iframe from Cypress.
class RolesAdminPage extends BasePage {
    MANAGE_SERVER_ROLES_PATH = '/cms/adminframe/default/en/settings.manageServerRoles.html'
    MANAGE_ROLES_AND_PERMISSIONS_PATH = '/cms/adminframe/default/en/settings.rolesAndPermissions.html'

    elements = {
        saveMembersBtn: '#saveButton',
        permissionGroups: {
            [PERMISSION_GROUPS.serverAdmin]: '#switchToGroup1',
            [PERMISSION_GROUPS.other]: '#switchToGroup2',
        },
        serverAdministrationGroupBtn: '#switchToGroup1',
        otherPermissionsGroupBtn: '#switchToGroup2',
        savePermissionsBtn: "button[name='_eventId_saveRole']",
    }

    /*
     * AUXILIARY METHODS
     */

    private visitRolesAndPermissions() {
        cy.visit(Cypress.config().baseUrl + this.MANAGE_ROLES_AND_PERMISSIONS_PATH, { failOnStatusCode: false })
        return this
    }

    /**
     * Opens role for editing (also handles the case with sporadical gwt login window)
     * @param roleLabel
     * @param attempt
     * @private
     */
    private editRole(roleLabel: string, attempt = 1) {
        const maxAttempts = 3
        const retry = () => {
            if (attempt >= maxAttempts) {
                throw new Error(`Could not open role "${roleLabel}" after ${attempt} attempts`)
            }

            cy.login()
            this.visitRolesAndPermissions()
            this.editRole(roleLabel, attempt + 1)
        }

        // This legacy webflow screen intermittently fails to render the role list (a transient
        // backend node-loading hiccup), bounces back to the login page instead of opening the
        // role, or lands on a blank page (the URL updates to the correct view-state, but the
        // response body comes back empty - a race in the underlying webflow's POST/redirect
        // handling under fast automated clicks). All are unrelated quirks of this admin screen,
        // so detect and retry rather than fail the test outright.
        cy.get('body').then(($body) => {
            const roleLink = $body.find('a').filter((_, el) => (el.textContent || '').trim().startsWith(roleLabel))
            if (roleLink.length === 0) {
                retry()
                return
            }

            cy.wrap(roleLink.first()).click()
            cy.get('body').then(($afterClickBody) => {
                const isLoginPage = $afterClickBody.find('input[type="password"]').length > 0
                const isMissingRoleDetailsContent =
                    $afterClickBody.find(
                        `${this.elements.serverAdministrationGroupBtn}, ${this.elements.otherPermissionsGroupBtn}`,
                    ).length === 0
                if (isLoginPage || isMissingRoleDetailsContent) {
                    retry()
                }
            })
        })
        return this
    }

    /**
     * Turns permission ON/OFF
     * @param permissionPath
     * @param enabled
     * @private
     */
    private setPermissionEnabled(permissionPath: string, enabled: boolean) {
        cy.get(`a.checkbox[path='${permissionPath}']`).then(($permission) => {
            if ($permission.hasClass('checked') !== enabled) {
                cy.wrap($permission).click({ force: true })
                cy.get(this.elements.savePermissionsBtn).click()
            }
        })
        return this
    }

    /**
     * Assigns server-admin role to the user
     * @param username
     * @param member
     */
    setServerAdminRoleMember(username: string, member: boolean) {
        cy.visit(Cypress.config().baseUrl + this.MANAGE_SERVER_ROLES_PATH, { failOnStatusCode: false })
        cy.get(`#${SERVER_ADMINISTRATOR_ROLE.id}`).click()

        // The checkbox is visually hidden behind a styled sibling, so a real click doesn't
        // reliably reach it, and dispatching a synthetic "change" event isn't picked up
        // reliably either. Instead, mirror exactly what the page's own inline script does on
        // a real change: update its `editRoleMembers` bookkeeping object directly, then submit.
        cy.window().then((win) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const pageWin = win as any
            const $checkbox = pageWin.jQuery(`input.selectedMember[value='${username}']`)
            if ($checkbox.is(':checked') !== member) {
                $checkbox.prop('checked', member)
                const name = encodeURIComponent('u:' + username)
                const list = member ? pageWin.editRoleMembers.addedMembers : pageWin.editRoleMembers.removedMembers
                if (list.indexOf(name) === -1) {
                    list.push(name)
                }

                pageWin.jQuery(this.elements.saveMembersBtn).removeAttr('disabled')
                cy.get(this.elements.saveMembersBtn).should('not.be.disabled').click()
            }
        })
        return this
    }

    /**
     * Updates permission for a given role
     * @param role
     * @param group
     * @param permission
     * @param enabled
     */
    updateRolePermission(role: string, group: string, permission: string, enabled: boolean) {
        this.visitRolesAndPermissions()
        this.editRole(role)
        cy.get(this.elements.permissionGroups[group]).click()
        this.setPermissionEnabled(permission, enabled)
        return this
    }
}

export const rolesAdminPage = new RolesAdminPage()
