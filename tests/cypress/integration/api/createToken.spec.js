import {apolloClient} from '../../support/apollo'
import {createToken, getToken, getTokens, deleteToken, verifyToken} from "./gql";

describe('token creation', () => {
    afterEach(async function() {
        const client = apolloClient();
        return Promise.all((await getTokens('root', client)).nodes
            .filter(token => token.name.startsWith('test-'))
            .map(token => deleteToken(token.key, client)));
    });

    it('should create a simple token', async function () {
        const client = apolloClient();
        let name = 'test-' + (new Date().getTime());
        const token = await createToken('root', name, null, null, client);

        expect(token).to.have.length.of.at.least(10, 'not a token')
        expect(await verifyToken(token, client)).to.be.true;

        const tokenDetails = await getToken('root', name, client);
        expect(tokenDetails).to.not.be.null;
        expect(tokenDetails.name).to.equals(name);
    });

    it('should create a disabled token', async function () {
        const client = apolloClient();
        let name = 'test-' + (new Date().getTime());
        const token = await createToken('root', name, "DISABLED", null, client);

        expect(token).to.have.length.of.at.least(10, 'not a token')
        expect(await verifyToken(token, client)).to.be.false;

        const tokenDetails = await getToken('root', name, client);
        expect(tokenDetails).to.not.be.null;
        expect(tokenDetails.name).to.equals(name);
    });

    it('should create an expired token', async function () {
        const client = apolloClient();
        let name = 'test-' + (new Date().getTime());
        const token = await createToken('root', name, null, '2019-01-01', client);

        expect(token).to.have.length.of.at.least(10, 'not a token')
        expect(await verifyToken(token, client)).to.be.false;

        const tokenDetails = await getToken('root', name, client);
        expect(tokenDetails).to.not.be.null;
        expect(tokenDetails.name).to.equals(name);
    });

})
