import { apolloClient } from '../../support/apollo'
import { createToken, getToken, getTokens, deleteToken, verifyToken } from '../../support/gql'

describe('token creation', () => {
    afterEach(async function () {
        const client = apolloClient()
        return Promise.all(
            (await getTokens('root', client)).nodes
                .filter((token) => token.name.startsWith('test-'))
                .map((token) => deleteToken(token.key, client)),
        )
    })

    it('should create a simple token', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()
        const token = await createToken('root', name, null, null, client)

        expect(token).to.have.length.of.at.least(10, 'not a token')
        expect(await verifyToken(token, client)).to.be.true

        const tokenDetails = await getToken('root', name, client)
        expect(tokenDetails).to.not.be.null
        expect(tokenDetails.name).to.equals(name)
    })

    it('should create a disabled token', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()
        const token = await createToken('root', name, 'DISABLED', null, client)

        expect(token).to.have.length.of.at.least(10, 'not a token')
        expect(await verifyToken(token, client)).to.be.false

        const tokenDetails = await getToken('root', name, client)
        expect(tokenDetails).to.not.be.null
        expect(tokenDetails.name).to.equals(name)
    })

    it('should create an expired token', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()
        const token = await createToken('root', name, null, '2019-01-01', client)

        expect(token).to.have.length.of.at.least(10, 'not a token')
        expect(await verifyToken(token, client)).to.be.false

        const tokenDetails = await getToken('root', name, client)
        expect(tokenDetails).to.not.be.null
        expect(tokenDetails.name).to.equals(name)
    })

    it('should not create 2 tokens with the same name', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()
        const token = await createToken('root', name, null, '2019-01-01', client)
        let error
        try {
            await createToken('root', name, null, '2019-01-02', client)
        } catch (e) {
            error = e
        }

        expect(token).to.have.length.of.at.least(10, 'not a token')
        expect(error).to.not.be.null
    })

    it('should not create a tokens invalid user', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()
        let error
        try {
            await createToken('rootxxxx', name, null, '2019-01-01', client)
        } catch (e) {
            error = e
        }

        expect(error).to.not.be.null
    })

    it('should not create a tokens invalid date', async function () {
        const client = apolloClient()
        const name = 'test-' + new Date().getTime()
        let error
        try {
            await createToken('root', name, null, '2019-0sadasd1-01', client)
        } catch (e) {
            error = e
        }

        expect(error).to.not.be.null
    })
})
