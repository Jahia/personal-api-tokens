import { apollo } from '../support/apollo'

export function setupRoles() {
    before('create role', async function () {
        await apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        }).mutate({
            mutation: require(`graphql-tag/loader!../fixtures/createRoles.graphql`),
        })
    })

    after('remove role', async function () {
        await apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        }).mutate({
            mutation: require(`graphql-tag/loader!../fixtures/deleteRoles.graphql`),
        })
    })
}
