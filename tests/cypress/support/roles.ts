// Removes a single permission name from a role's j:permissionNames property, e.g. reverting
// a permission checked via the "Roles and permissions" admin screen. Used only for test cleanup,
// where exercising the (flaky, legacy) admin UI again isn't necessary.
export function revokeRolePermission(rolePath: string, permissionName: string): Cypress.Chainable {
    return cy
        .apollo({ mutationFile: 'removeRolePermission.graphql', variables: { path: rolePath, permissionName } })
        .its('data.jcr.mutateNode.mutateProperty.removeValue')
        .should('eq', true)
}

// Adds a single permission name to a role's j:permissionNames property, once, e.g. restoring a
// permission unchecked via the "Roles and permissions" admin screen. Used only for test cleanup.
export function grantRolePermission(rolePath: string, permissionName: string): Cypress.Chainable {
    return cy
        .apollo({ mutationFile: 'addRolePermission.graphql', variables: { path: rolePath, permissionName } })
        .its('data.jcr.mutateNode.added.addValue')
        .should('eq', true)
}
