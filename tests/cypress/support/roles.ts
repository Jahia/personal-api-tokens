import gql from 'graphql-tag'

const REMOVE_ROLE_PERMISSION_NAME = gql`
    mutation($path: String!, $permissionName: String!) {
        jcr {
            mutateNode(pathOrId: $path) {
                mutateProperty(name: "j:permissionNames") {
                    removeValue(value: $permissionName)
                }
            }
        }
    }
`

// Removes a single permission name from a role's j:permissionNames property, e.g. reverting
// a permission checked via the "Roles and permissions" admin screen. Used only for test cleanup,
// where exercising the (flaky, legacy) admin UI again isn't necessary.
export function revokeRolePermission(rolePath: string, permissionName: string): Cypress.Chainable {
    return cy.apollo({ mutation: REMOVE_ROLE_PERMISSION_NAME, variables: { path: rolePath, permissionName } })
}

const DELETE_ROLE = gql`
    mutation($path: String!) {
        jcr {
            deleteNode(pathOrId: $path)
        }
    }
`

// Deletes a whole role node, e.g. a custom role created via the "Roles and permissions" admin
// screen's "add" field for a test. Used only for test cleanup.
export function deleteRole(rolePath: string): Cypress.Chainable {
    return cy.apollo({ mutation: DELETE_ROLE, variables: { path: rolePath } })
}
