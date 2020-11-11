import { apolloClient } from '../../support/apollo'
import { createToken, getToken, deleteToken } from '../../support/gql'

describe('token creation', () => {
    it('should delete a token', async function () {
        const client = apolloClient()
        const name = 'test' + new Date().getTime()
        await createToken('root', name, null, null, client)
        const tokenDetails = await getToken('root', name, client)
        const deleteTokenResult = await deleteToken(tokenDetails.key, client)

        expect(deleteTokenResult).to.be.true

        expect(await getToken('root', name, client)).to.be.null
    })
})
