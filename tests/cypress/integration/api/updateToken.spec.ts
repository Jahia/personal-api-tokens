import { apollo } from '../../support/apollo'
import { DocumentNode } from 'graphql'

import { createToken, deleteToken, getToken, getTokens } from '../../support/gql'
import { setupRoles } from '../setupRoles'

describe('Token update via API - mutation.admin.personalApiTokens.updateToken', () => {
    let GQL_UPDATE: DocumentNode

    setupRoles()

    before('load graphql file', function () {
        GQL_UPDATE = require(`graphql-tag/loader!../../fixtures/updateToken.graphql`)
    })

    afterEach(function () {
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        return Promise.all([
            getTokens({ userId: 'root' }, client).then((t) =>
                t.nodes
                    .filter((token) => token.name.startsWith('test-'))
                    .map((token) => deleteToken(token.key, client)),
            ),
            getTokens({ userId: 'irina' }, client).then((t) =>
                t.nodes
                    .filter((token) => token.name.startsWith('test-'))
                    .map((token) => deleteToken(token.key, client)),
            ),
            getTokens({ userId: 'mathias' }, client).then((t) =>
                t.nodes
                    .filter((token) => token.name.startsWith('test-'))
                    .map((token) => deleteToken(token.key, client)),
            ),
        ])
    })

    it('Update Token by providing tokenKey, NEW tokenName, null expireAt, null state', async function () {
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const nameA = 'test-A' + new Date().getTime()
        const nameB = 'test-B' + new Date().getTime()

        await createToken(nameA, null, null, client)
        const tokenDetails = await getToken('root', nameA, client)

        const response = await apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        }).mutate({
            mutation: GQL_UPDATE,
            variables: {
                tokenKey: tokenDetails.key,
                tokenName: nameB,
                expireAt: null,
                tokenState: null,
            },
        })
        cy.log(JSON.stringify(response))
        expect(response.errors).to.be.undefined

        expect(response.data.admin.personalApiTokens.updateToken).to.be.true

        const renamedToken = await getToken('root', nameB, client)
        expect(renamedToken).to.not.be.null
        expect(renamedToken.name).to.equals(nameB)

        expect(await getToken('root', nameA, client)).to.be.null
    })

    it('Update Token by providing tokenKey, null tokenName, null expireAt, null state', async function () {
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const nameA = 'test-A' + new Date().getTime()

        await createToken(nameA, null, null, client)
        const tokenDetails = await getToken('root', nameA, client)

        const response = await apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        }).mutate({
            mutation: GQL_UPDATE,
            variables: {
                tokenKey: tokenDetails.key,
                tokenName: null,
                expireAt: null,
                tokenState: null,
            },
        })
        cy.log(JSON.stringify(response))
        expect(response.errors).to.be.undefined
        expect(response.data.admin.personalApiTokens.updateToken).to.be.true

        const tokenA = await getToken('root', nameA, client)
        expect(tokenA.name).to.equals(tokenDetails.name)
    })

    it('Update Token by providing tokenKey, EMPTY tokenName, null expireAt, null state', async function () {
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const nameA = 'test-A' + new Date().getTime()

        await createToken(nameA, null, null, client)
        const tokenDetails = await getToken('root', nameA, client)

        try {
            await apollo(Cypress.config().baseUrl, {
                username: 'root',
                password: Cypress.env('SUPER_USER_PASSWORD'),
            }).mutate({
                mutation: GQL_UPDATE,
                variables: {
                    tokenKey: tokenDetails.key,
                    tokenName: '',
                    expireAt: null,
                    tokenState: null,
                },
            })
        } catch (err) {
            cy.log(JSON.stringify(err))
            expect(err.graphQLErrors[0].message).to.contain(
                'javax.jcr.ItemExistsException: Same name siblings are not allowed: node /users/root/tokens',
            )
        }

        const tokenA = await getToken('root', nameA, client)
        expect(tokenA.name).to.equals(tokenDetails.name)
    })

    it('Update Token by providing tokenKey, EXISTING (other) tokenName, null expireAt, null state', async function () {
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const nameA = 'test-A' + new Date().getTime()
        const nameB = 'test-B' + new Date().getTime()

        await createToken(nameA, null, null, client)
        const tokenADetails = await getToken('root', nameA, client)

        await createToken(nameB, null, null, client)
        const tokenBDetails = await getToken('root', nameB, client)

        try {
            await apollo(Cypress.config().baseUrl, {
                username: 'root',
                password: Cypress.env('SUPER_USER_PASSWORD'),
            }).mutate({
                mutation: GQL_UPDATE,
                variables: {
                    tokenKey: tokenADetails.key,
                    tokenName: nameB,
                    expireAt: null,
                    tokenState: null,
                },
            })
        } catch (err) {
            cy.log(JSON.stringify(err))
            expect(err.graphQLErrors[0].message).to.contain(
                'javax.jcr.ItemExistsException: Same name siblings are not allowed: node /users/root/tokens/test',
            )
        }

        const tokenA = await getToken('root', nameA, client)
        expect(tokenA.name).to.equals(nameA)

        const tokenB = await getToken('root', nameB, client)
        expect(tokenB.name).to.equals(nameB)
        expect(tokenB.key).to.equals(tokenBDetails.key)
    })

    it('Update Token by providing tokenKey, null tokenName, null expireAt, DISABLED state', async function () {
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const name = 'test-' + new Date().getTime()

        await createToken(name, null, null, client)
        const tokenDetails = await getToken('root', name, client)

        const response = await apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        }).mutate({
            mutation: GQL_UPDATE,
            variables: {
                tokenKey: tokenDetails.key,
                tokenName: null,
                expireAt: null,
                tokenState: 'DISABLED',
            },
        })
        cy.log(JSON.stringify(response))
        expect(response.errors).to.be.undefined
        expect(response.data.admin.personalApiTokens.updateToken).to.be.true

        const updatedToken = await getToken('root', name, client)
        expect(updatedToken).to.not.be.null
        expect(updatedToken.state).to.equals('DISABLED')
    })

    it('Update Token by providing tokenKey, null tokenName, null expireAt, INCORRECT state (INACTIVE)', async function () {
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const name = 'test-' + new Date().getTime()

        await createToken(name, null, null, client)
        const tokenDetails = await getToken('root', name, client)

        try {
            await apollo(Cypress.config().baseUrl, {
                username: 'root',
                password: Cypress.env('SUPER_USER_PASSWORD'),
            }).mutate({
                mutation: GQL_UPDATE,
                variables: {
                    tokenKey: tokenDetails.key,
                    tokenName: null,
                    expireAt: null,
                    tokenState: 'INACTIVE',
                },
            })
        } catch (err) {
            cy.log(JSON.stringify(err))
            expect(err.graphQLErrors[0].message).to.contain('Internal Server Error(s) while executing query')
        }

        const updatedToken = await getToken('root', name, client)
        expect(updatedToken).to.not.be.null
        expect(updatedToken.state).to.equals(tokenDetails.state)
    })

    it('Update Token by providing tokenKey, null tokenName, expireAt, null state', async function () {
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const name = 'test-' + new Date().getTime()
        const expireAt = '2010-01-01'

        await createToken(name, null, null, client)
        const tokenDetails = await getToken('root', name, client)

        const response = await apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        }).mutate({
            mutation: GQL_UPDATE,
            variables: {
                tokenKey: tokenDetails.key,
                tokenName: null,
                expireAt: expireAt,
                tokenState: null,
            },
        })
        cy.log(JSON.stringify(response))
        expect(response.data.admin.personalApiTokens.updateToken).to.be.true

        const updatedToken = await getToken('root', name, client)
        expect(updatedToken).to.not.be.null
        expect(updatedToken.expireAt.slice(0, 10)).to.equals(expireAt)
    })

    it('Update Token by providing tokenKey, null tokenName, EMPTY expireAt, null state', async function () {
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const name = 'test-' + new Date().getTime()
        const expireAt = ''

        await createToken(name, null, null, client)
        const tokenDetails = await getToken('root', name, client)

        const response = await apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        }).mutate({
            mutation: GQL_UPDATE,
            variables: {
                tokenKey: tokenDetails.key,
                tokenName: null,
                expireAt: expireAt,
                tokenState: null,
            },
        })
        cy.log(JSON.stringify(response))
        expect(response.data.admin.personalApiTokens.updateToken).to.be.true

        const updatedToken = await getToken('root', name, client)
        expect(updatedToken).to.not.be.null
        expect(updatedToken.expireAt).to.equals(tokenDetails.expireAt)
    })

    it('Update Token by providing tokenKey, null tokenName, INCORRECT expireAt, null state', async function () {
        const client = apollo(Cypress.config().baseUrl, {
            username: 'root',
            password: Cypress.env('SUPER_USER_PASSWORD'),
        })
        const name = 'test-' + new Date().getTime()
        const expireAt = '2020-ABCD-12-1'

        await createToken(name, null, null, client)
        const tokenDetails = await getToken('root', name, client)

        try {
            await apollo(Cypress.config().baseUrl, {
                username: 'root',
                password: Cypress.env('SUPER_USER_PASSWORD'),
            }).mutate({
                mutation: GQL_UPDATE,
                variables: {
                    tokenKey: tokenDetails.key,
                    tokenName: null,
                    expireAt: expireAt,
                    tokenState: null,
                },
            })
        } catch (err) {
            cy.log(JSON.stringify(err))
            expect(err.graphQLErrors[0].message).to.contain('Internal Server Error(s) while executing query')
        }

        const updatedToken = await getToken('root', name, client)
        expect(updatedToken).to.not.be.null
        expect(updatedToken.expireAt).to.equals(tokenDetails.expireAt)
    })
})
