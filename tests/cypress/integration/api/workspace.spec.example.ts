// not an actual test. just demonstrates a test using .graphql/.gql files
import { apollo } from '../../support/apollo'
import { DocumentNode } from 'graphql'
import { setupRoles } from '../setupRoles'

describe('workspace api', () => {
    let workspace: DocumentNode

    setupRoles()

    before('load graphql file', function () {
        workspace = require(`graphql-tag/loader!../../fixtures/workspace.graphql`)
    })

    it('queries workspace correctly', async function () {
        const response = await apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        }).query({
            query: workspace,
            variables: {
                workspace: 'EDIT',
            },
        })
        expect(response.data.jcr.workspace).to.equal('EDIT')
    })
})
