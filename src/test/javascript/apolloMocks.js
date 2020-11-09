import {CreateTokenMutation, getCurrentUserName} from '../../main/javascript/PersonalApiTokens/MyApiTokens/MyApiTokens.gql';
export const createTokenMocks = [
    {
        request: {
            query: CreateTokenMutation,
            variables: {
                userId: 'root',
                name: 'testToken',
                expireAt: '2020-11-11T07:24:00.000Z'
            }
        },
        result: () => {
            return {
                data: {
                    admin: {
                        personalApiTokens: {
                            createToken: 'psDi+YEQQ768/Wp+J8yL5r9p8+4r8DbSw+Dji1t9Dyk='
                        }
                    }
                }
            };
        }
    },
    {
        request: {
            query: CreateTokenMutation,
            variables: {
                userId: 'root',
                name: 'testToken',
                expireAt: null
            }
        },
        result: () => {
            return {
                data: {
                    admin: {
                        personalApiTokens: {
                            createToken: 'tokenNoExpiryDate'
                        }
                    }
                }
            };
        }
    },
    {
        request: {
            query: getCurrentUserName
        },
        result: () => {
            return {
                data: {
                    currentUser: {
                        name: 'root'
                    }
                }
            };
        }
    }
];
