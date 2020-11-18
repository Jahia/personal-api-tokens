import {CreateTokenMutation, getCurrentUserName} from '../../main/javascript/PersonalApiTokens/MyApiTokens/MyApiTokens.gql';
import moment from 'moment';
const expTime = moment('2020/11/11 02:24').utc().toISOString();
import {DeleteTokenMutation, getTokens} from '../../main/javascript/PersonalApiTokens/TokensList/TokensList.gql';

const tokenResult = {
    data: {
        admin: {
            personalApiTokens: {
                tokens: {
                    pageInfo: {
                        totalCount: 31,
                        nodesCount: 5,
                        startCursor: 'MWI4YzhiMDYtYzliZC00MzE0LWE5ODEtNjhjOGUyZmUxZDNh',
                        endCursor: 'MWY0ZjAyMzMtMjZmYy00YjM0LWJjN2YtYjNmY2NhOWE5ZjVi',
                        hasNextPage: true,
                        hasPreviousPage: false
                    },
                    nodes: [
                        {
                            name: 'TestToken',
                            key: '1b8c8b06-c9bd-4314-a981-68c8e2fe1d3a',
                            expireAt: '2020-11-11T15:57:23.762-05:00',
                            state: 'ACTIVE',
                            createdAt: '2020-11-10T15:58:06.808-05:00',
                            updatedAt: '2020-11-10T15:58:06.832-05:00',
                            user: {
                                name: 'root'
                            }
                        },
                        {
                            name: 'Yurec',
                            key: 'e2c6c788-a685-4d0e-a687-bfff9f3af5cc',
                            expireAt: '2020-11-11T15:44:36.353-05:00',
                            state: 'ACTIVE',
                            createdAt: '2020-11-10T15:44:47.800-05:00',
                            updatedAt: '2020-11-10T15:44:47.827-05:00',
                            user: {
                                name: 'root'
                            }
                        },
                        {
                            name: 'Super Token',
                            key: '46569c17-d953-4ede-a0c3-329e5bc8a61f',
                            expireAt: '2020-11-11T15:57:02.048-05:00',
                            state: 'ACTIVE',
                            createdAt: '2020-11-10T15:57:18.036-05:00',
                            updatedAt: '2020-11-10T15:57:18.058-05:00',
                            user: {
                                name: 'root'
                            }
                        },
                        {
                            name: 'ghfghfghfghf',
                            key: '0f5cd483-3e0b-4b0c-87ea-1c13f3b358b2',
                            expireAt: '2020-11-10T12:22:26.685-05:00',
                            state: 'ACTIVE',
                            createdAt: '2020-11-09T12:22:30.831-05:00',
                            updatedAt: '2020-11-09T12:22:30.857-05:00',
                            user: {
                                name: 'root'
                            }
                        },
                        {
                            name: 'Anton',
                            key: '1f4f0233-26fc-4b34-bc7f-b3fcca9a9f5b',
                            expireAt: '2020-11-10T11:57:47.827-05:00',
                            state: 'ACTIVE',
                            createdAt: '2020-11-09T12:00:16.624-05:00',
                            updatedAt: '2020-11-09T12:00:16.651-05:00',
                            user: {
                                name: 'root'
                            }
                        }
                    ]
                }
            }
        }
    }
};

const tokenResultWithoutTestToken = {
    data: {
        admin: {
            personalApiTokens: {
                tokens: {
                    pageInfo: {
                        totalCount: 31,
                        nodesCount: 5,
                        startCursor: 'MWI4YzhiMDYtYzliZC00MzE0LWE5ODEtNjhjOGUyZmUxZDNh',
                        endCursor: 'MWY0ZjAyMzMtMjZmYy00YjM0LWJjN2YtYjNmY2NhOWE5ZjVi',
                        hasNextPage: true,
                        hasPreviousPage: false
                    },
                    nodes: [
                        {
                            name: 'Morceaux',
                            key: '1b8c8b06-c9bd-4314-a981-68c8e2fe1dsa',
                            expireAt: '2020-11-11T15:57:23.762-05:00',
                            state: 'ACTIVE',
                            createdAt: '2020-11-10T15:58:06.808-05:00',
                            updatedAt: '2020-11-10T15:58:06.832-05:00',
                            user: {
                                name: 'root'
                            }
                        },
                        {
                            name: 'Yurec',
                            key: 'e2c6c788-a685-4d0e-a687-bfff9f3af5cc',
                            expireAt: '2020-11-11T15:44:36.353-05:00',
                            state: 'ACTIVE',
                            createdAt: '2020-11-10T15:44:47.800-05:00',
                            updatedAt: '2020-11-10T15:44:47.827-05:00',
                            user: {
                                name: 'root'
                            }
                        },
                        {
                            name: 'Super Token',
                            key: '46569c17-d953-4ede-a0c3-329e5bc8a61f',
                            expireAt: '2020-11-11T15:57:02.048-05:00',
                            state: 'ACTIVE',
                            createdAt: '2020-11-10T15:57:18.036-05:00',
                            updatedAt: '2020-11-10T15:57:18.058-05:00',
                            user: {
                                name: 'root'
                            }
                        },
                        {
                            name: 'ghfghfghfghf',
                            key: '0f5cd483-3e0b-4b0c-87ea-1c13f3b358b2',
                            expireAt: '2020-11-10T12:22:26.685-05:00',
                            state: 'ACTIVE',
                            createdAt: '2020-11-09T12:22:30.831-05:00',
                            updatedAt: '2020-11-09T12:22:30.857-05:00',
                            user: {
                                name: 'root'
                            }
                        },
                        {
                            name: 'Anton',
                            key: '1f4f0233-26fc-4b34-bc7f-b3fcca9a9f5b',
                            expireAt: '2020-11-10T11:57:47.827-05:00',
                            state: 'ACTIVE',
                            createdAt: '2020-11-09T12:00:16.624-05:00',
                            updatedAt: '2020-11-09T12:00:16.651-05:00',
                            user: {
                                name: 'root'
                            }
                        }
                    ]
                }
            }
        }
    }
};
export const createTokenMocks = [
    {
        request: {
            query: CreateTokenMutation,
            variables: {
                name: 'testToken',
                expireAt: expTime
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
            query: DeleteTokenMutation,
            variables: {
                key: '1b8c8b06-c9bd-4314-a981-68c8e2fe1d3a'
            }
        },
        result: () => {
            return {
                data: {
                    admin: {
                        personalApiTokens: {
                            deleteToken: true
                        }
                    }
                }
            };
        }
    },
    {
        request: {
            query: getTokens,
            variables: {
                limit: 25,
                offset: 0,
                fieldSorter: {
                    fieldName: 'createdAt',
                    sortType: 'DESC'
                }
            }
        },
        result: () => {
            return tokenResult;
        }
    },
    {
        request: {
            query: getTokens,
            variables: {
                limit: 25,
                offset: 0,
                fieldSorter: {
                    fieldName: 'createdAt',
                    sortType: 'DESC'
                }
            }
        },
        result: () => {
            return tokenResultWithoutTestToken;
        }
    },
    {
        request: {
            query: getTokens,
            variables: {
                limit: 25,
                offset: 0,
                fieldSorter: {
                    fieldName: 'createdAt',
                    sortType: 'ASC'
                }
            }
        },
        result: () => {
            return tokenResult;
        }
    },
    {
        request: {
            query: CreateTokenMutation,
            variables: {
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

export const snapshotMocks = [
    {
        request: {
            query: CreateTokenMutation,
            variables: {
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
            query: getTokens,
            variables: {
                limit: 25,
                offset: 0,
                fieldSorter: {
                    fieldName: 'createdAt',
                    sortType: 'DESC'
                }
            }
        },
        result: () => {
            return {
                data: {
                    admin: {
                        personalApiTokens: {
                            tokens: {
                                pageInfo: {
                                    totalCount: 0,
                                    nodesCount: 0,
                                    startCursor: null,
                                    endCursor: null,
                                    hasNextPage: false,
                                    hasPreviousPage: false
                                },
                                nodes: []
                            }
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
