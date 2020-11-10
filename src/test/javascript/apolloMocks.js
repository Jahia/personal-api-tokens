import {CreateTokenMutation, getCurrentUserName} from '../../main/javascript/PersonalApiTokens/MyApiTokens/MyApiTokens.gql';
export const createTokenMocks = [
    {
        request: {
            query: CreateTokenMutation,
            variables: {
                userId: 'root',
                name: 'testToken',
                expireAt: '2020-11-11T02:24:00.000Z'
            }
        },
        result: () => {
            return {
                data: {
                    admin: {
                        personalApiTokens: {
                            createToken: 'tokenWithExpiryDate'
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
                expireAt: '2020-11-11T07:24:00.000Z'
            }
        },
        result: () => {
            return {
                data: {
                    admin: {
                        personalApiTokens: {
                            createToken: 'tokenWithExpiryDate'
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
