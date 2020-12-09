import { apolloClient } from '../../support/apollo'

import { createToken, deleteToken, getTokens, updateToken } from '../../support/gql'

describe('Pagination and ordering - query.admin.personalApiTokens.tokens', () => {
    before('load graphql file', async function () {
        const client = apolloClient()
        await createToken('test-X-A', null, null, client)
        await createToken('test-X-B', null, null, client)
        await createToken('test-X-C', null, null, client)
        await createToken('test-X-D', null, null, client)
        await createToken('test-X-E', null, null, client)
        await createToken('test-X-F', null, null, client)
        await createToken('test-X-G', null, null, client)
        await createToken('test-X-H', null, null, client)
        await createToken('test-X-I', null, null, client)
        await createToken('test-X-J', null, null, client)

        // Distable the first 3 tokens
        const tokens = await getTokens({ userId: 'root', limit: 3, sort: { fieldName: 'name', sortType: 'ASC' } })
        for (const token of tokens.nodes) {
            await updateToken(token.key, null, 'DISABLED', null, client)
        }
    })

    after(async function () {
        const client = apolloClient()
        return Promise.all(
            (await getTokens({ userId: 'root' }, client)).nodes
                .filter((token) => token.name.startsWith('test-'))
                .map((token) => deleteToken(token.key, client)),
        )
    })

    it('Shows only 2 tokens', async function () {
        const tokens = await getTokens({ userId: 'root', limit: 2 })
        expect(tokens.errors).to.be.undefined
        expect(tokens.pageInfo.totalCount).to.equal(10)
        expect(tokens.pageInfo.hasPreviousPage).to.be.false
        expect(tokens.pageInfo.hasNextPage).to.be.true
        expect(tokens.nodes.length).to.equal(2)
    })

    it('Shows only 2 tokens, ordered', async function () {
        const tokens = await getTokens({ userId: 'root', limit: 2, sort: { fieldName: 'name', sortType: 'ASC' } })
        expect(tokens.errors).to.be.undefined
        expect(tokens.nodes.length).to.equal(2)
        expect(tokens.pageInfo.hasPreviousPage).to.be.false
        expect(tokens.pageInfo.hasNextPage).to.be.true
        expect(tokens.nodes[0].name).to.equal('test-X-A')
        expect(tokens.nodes[1].name).to.equal('test-X-B')
    })

    it('Shows only 2 tokens, ordered descending', async function () {
        const tokens = await getTokens({ userId: 'root', limit: 2, sort: { fieldName: 'name', sortType: 'DESC' } })
        expect(tokens.errors).to.be.undefined
        expect(tokens.nodes.length).to.equal(2)
        expect(tokens.pageInfo.hasPreviousPage).to.be.false
        expect(tokens.pageInfo.hasNextPage).to.be.true
        expect(tokens.nodes[0].name).to.equal('test-X-J')
        expect(tokens.nodes[1].name).to.equal('test-X-I')
    })

    it('Order tokens by state ASC', async function () {
        const tokens = await getTokens({ userId: 'root', limit: 20, sort: { fieldName: 'state', sortType: 'ASC' } })
        expect(tokens.errors).to.be.undefined
        // The first 3 items of the array should be ACTIVE
        expect(tokens.nodes.slice(0, 3).filter(t => t.state === 'ACTIVE').length).to.equal(3)
        // While the last 3 items should be DISABLED
        expect(tokens.nodes.slice(-3).filter(t => t.state === 'DISABLED').length).to.equal(3)
    })

    it('Order tokens by state DESC', async function () {
        const tokens = await getTokens({ userId: 'root', limit: 20, sort: { fieldName: 'state', sortType: 'DESC' } })
        expect(tokens.errors).to.be.undefined
        // The first 3 items of the array should be DISABLED
        expect(tokens.nodes.slice(0, 3).filter(t => t.state === 'DISABLED').length).to.equal(3)
        // While the last 3 items should be ACTIVE
        expect(tokens.nodes.slice(-3).filter(t => t.state === 'ACTIVE').length).to.equal(3)
    })

    it('Shows only 2 tokens with offset', async function () {
        const tokens = await getTokens({
            userId: 'root',
            limit: 2,
            offset: 2,
            sort: { fieldName: 'name', sortType: 'ASC' },
        })
        expect(tokens.errors).to.be.undefined
        expect(tokens.nodes.length).to.equal(2)
        expect(tokens.pageInfo.hasPreviousPage).to.be.true
        expect(tokens.pageInfo.hasNextPage).to.be.true
        expect(tokens.nodes[0].name).to.equal('test-X-C')
        expect(tokens.nodes[1].name).to.equal('test-X-D')
    })

    it('Shows only 2 tokens with offset, ordered descending', async function () {
        const tokens = await getTokens({
            userId: 'root',
            limit: 2,
            offset: 2,
            sort: { fieldName: 'name', sortType: 'DESC' },
        })
        expect(tokens.errors).to.be.undefined
        expect(tokens.nodes.length).to.equal(2)
        expect(tokens.pageInfo.hasPreviousPage).to.be.true
        expect(tokens.pageInfo.hasNextPage).to.be.true
        expect(tokens.nodes[0].name).to.equal('test-X-H')
        expect(tokens.nodes[1].name).to.equal('test-X-G')
    })

    it('Shows only the last token', async function () {
        const tokens = await getTokens({
            userId: 'root',
            limit: 2,
            offset: 9,
            sort: { fieldName: 'name', sortType: 'ASC' },
        })
        expect(tokens.errors).to.be.undefined
        expect(tokens.nodes.length).to.equal(1)
        expect(tokens.pageInfo.hasPreviousPage).to.be.true
        expect(tokens.pageInfo.hasNextPage).to.be.false
        expect(tokens.nodes[0].name).to.equal('test-X-J')
    })

    it('Shows no token if offset is beyond limit', async function () {
        const tokens = await getTokens({
            userId: 'root',
            limit: 2,
            offset: 10,
            sort: { fieldName: 'name', sortType: 'ASC' },
        })
        expect(tokens.errors).to.be.undefined
        expect(tokens.pageInfo.totalCount).to.equal(10)
        expect(tokens.pageInfo.hasPreviousPage).to.be.true
        expect(tokens.pageInfo.hasNextPage).to.be.false
        expect(tokens.nodes.length).to.equal(0)
    })

    it('Shows all tokens with high limit', async function () {
        const tokens = await getTokens({ userId: 'root', limit: 100, sort: { fieldName: 'name', sortType: 'ASC' } })
        expect(tokens.errors).to.be.undefined
        expect(tokens.pageInfo.totalCount).to.equal(10)
        expect(tokens.pageInfo.hasPreviousPage).to.be.false
        expect(tokens.pageInfo.hasNextPage).to.be.false
        expect(tokens.nodes.length).to.equal(10)
    })

    it('Shows no tokens with zero limit', async function () {
        const tokens = await getTokens({ userId: 'root', limit: 0, sort: { fieldName: 'name', sortType: 'ASC' } })
        expect(tokens.errors).to.be.undefined
        expect(tokens.pageInfo.totalCount).to.equal(10)
        expect(tokens.pageInfo.hasPreviousPage).to.be.false
        expect(tokens.pageInfo.hasNextPage).to.be.true
        expect(tokens.nodes.length).to.equal(0)
    })
})
