import {createToken, getCurrentUserName} from '../../main/javascript/PersonalApiTokens/MyApiTokens/MyApiTokens.gql';
export const createTokenMocks = [
    {
        request: {
            query: createToken,
            variables: {
                name: 'testToken',
                userId: 'root',
                expireAt: '2020-11-11 5:30'
            }
        },
        result: () => {
            return {
                data: {
                    admin: {
                        personalApiTokens: {
                            createToken: 'dwkfewjkghefjkghejrkghrewjgherjgher12121212scdsfdsfdsf'
                        }
                    }
                }
            };
        }
    },
    {
        request: {
            query: getCurrentUserName,
            variables: {
                token: 'fgfdgfdgdfgdfgdfgdfgdfsgdfgdsfg'
            }
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
