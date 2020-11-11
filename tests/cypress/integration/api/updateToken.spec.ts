import { apolloClient } from '../../support/apollo'
import { createToken, deleteToken, getToken, getTokens, updateToken } from '../../support/gql'

describe('token update', () => {
    afterEach(async function () {
        const client = apolloClient()
        return Promise.all(
            (await getTokens('root', client)).nodes
                .filter((token) => token.name.startsWith('test-'))
                .map((token) => deleteToken(token.key, client)),
        )
    })

    it('should rename a token', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()
        await createToken('root', name, null, null, client)
        const tokenDetails = await getToken('root', name, client)
        const renamedTokenResult = await updateToken(tokenDetails.key, 'test-renamed-' + name, null, null, client)

        expect(renamedTokenResult).to.be.true

        expect(await getToken('root', name, client)).to.be.null
        expect(await getToken('root', 'test-renamed-' + name, client)).to.not.be.null
    })

    it('should disable a token', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()
        await createToken('root', name, null, null, client)
        const tokenDetails = await getToken('root', name, client)
        const updateTokenResult = await updateToken(tokenDetails.key, null, 'DISABLED', null, client)

        expect(updateTokenResult).to.be.true

        expect((await getToken('root', name, client)).state).to.equals('DISABLED')
    })

    it('should change expiration date', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()
        await createToken('root', name, null, null, client)
        const tokenDetails = await getToken('root', name, client)
        const updateTokenResult = await updateToken(tokenDetails.key, null, null, '2020-01-01', client)
        expect(updateTokenResult).to.be.true

        expect((await getToken('root', name, client)).expireAt).to.contains('2020-01-01')

        const updateTokenResult2 = await updateToken(tokenDetails.key, null, null, '', client)
        expect(updateTokenResult2).to.be.true

        expect((await getToken('root', name, client)).expireAt).to.be.null
    })
})
