import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {CreateTokenMutation} from '../../main/javascript/PersonalApiTokens/MyApiTokens/MyApiTokens.gql';
import {getUserInformation} from '../../main/javascript/PersonalApiTokens/UserApiTokens/UserApiTokens.gql';

import {DeleteTokenMutation, getTokens, StateTokenMutation} from '../../main/javascript/PersonalApiTokens/TokensList/TokensList.gql';
import {GetScopesQuery} from '../../main/javascript/PersonalApiTokens/ScopesSelector/ScopesSelector.gql';
dayjs.extend(utc);

const expTime = dayjs('2020/11/11 02:24', 'yyyy/MM/DD HH:mm').utc().format();

// eslint-disable-next-line max-params
export function tokenResultItem(name, key, expireAt, state = 'ACTIVE', createdAt = '2020-11-10T15:58:06.808-05:00', updatedAt = '2020-11-10T15:58:06.808-05:00', username = 'root') {
    return {
        name: name,
        key: key,
        expireAt: expireAt,
        state: state,
        createdAt: createdAt,
        updatedAt: updatedAt,
        user: {
            name: username
        }
    };
}

export const tokenResultWithoutTestToken = {
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
                        tokenResultItem('Morceaux', '1b8c8b06-c9bd-4314-a981-68c8e2fe1dsa', '2020-11-11T15:57:23.762-05:00', 'ACTIVE', '2020-11-10T15:58:06.808-05:00'),
                        tokenResultItem('Yurec', 'e2c6c788-a685-4d0e-a687-bfff9f3af5cc', '2020-11-11T15:57:23.762-05:00', 'ACTIVE', '2020-11-10T15:58:06.808-05:00'),
                        tokenResultItem('Super Token', '46569c17-d953-4ede-a0c3-329e5bc8a61f', '2020-11-11T15:57:23.762-05:00', 'ACTIVE', '2020-11-10T15:58:06.808-05:00'),
                        tokenResultItem('ghfghfghfghf', '0f5cd483-3e0b-4b0c-87ea-1c13f3b358b2', '2020-11-10T15:57:23.762-05:00', 'ACTIVE', '2020-11-09T15:58:06.808-05:00'),
                        tokenResultItem('Anton', '1f4f0233-26fc-4b34-bc7f-b3fcca9a9f5b', '2020-11-10T15:57:23.762-05:00', 'ACTIVE', '2020-11-09T15:58:06.808-05:00')
                    ]
                }
            }
        }
    }
};

export const tokenResult = {
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
                        tokenResultItem('TestToken', '1b8c8b06-c9bd-4314-a981-68c8e2fe1d3a', '2020-11-11T15:57:23.762-05:00', 'ACTIVE', '2020-11-10T15:58:06.808-05:00'),
                        tokenResultItem('Yurec', 'e2c6c788-a685-4d0e-a687-bfff9f3af5cc', '2020-11-11T15:57:23.762-05:00', 'ACTIVE', '2020-11-10T15:58:06.808-05:00'),
                        tokenResultItem('Super Token', '46569c17-d953-4ede-a0c3-329e5bc8a61f', '2020-11-11T15:57:23.762-05:00', 'ACTIVE', '2020-11-10T15:58:06.808-05:00'),
                        tokenResultItem('ghfghfghfghf', '0f5cd483-3e0b-4b0c-87ea-1c13f3b358b2', '2020-11-10T15:57:23.762-05:00', 'ACTIVE', '2020-11-09T15:58:06.808-05:00'),
                        tokenResultItem('Anton', '1f4f0233-26fc-4b34-bc7f-b3fcca9a9f5b', '2020-11-10T15:57:23.762-05:00', 'ACTIVE', '2020-11-09T15:58:06.808-05:00')
                    ]
                }
            }
        }
    }
};

export const tokenResultAllUsers = {
    data: {
        admin: {
            personalApiTokens: {
                tokens: {
                    pageInfo: {
                        totalCount: 6,
                        nodesCount: 6,
                        startCursor: 'MWI4YzhiMDYtYzliZC00MzE0LWE5ODEtNjhjOGUyZmUxZDNh',
                        endCursor: 'MWY0ZjAyMzMtMjZmYy00YjM0LWJjN2YtYjNmY2NhOWE5ZjVi',
                        hasNextPage: true,
                        hasPreviousPage: false
                    },
                    nodes: [
                        tokenResultItem('TestToken', '1b8c8b06-c9bd-4314-a981-68c8e2fe1d3a', '2020-11-11T15:57:23.762-05:00', 'ACTIVE', '2020-11-10T15:58:06.808-05:00'),
                        tokenResultItem('Yurec', 'e2c6c788-a685-4d0e-a687-bfff9f3af5cc', '2020-11-11T15:57:23.762-05:00', 'ACTIVE', '2020-11-10T15:58:06.808-05:00'),
                        tokenResultItem('Super Token', '46569c17-d953-4ede-a0c3-329e5bc8a61f', '2020-11-11T15:57:23.762-05:00', 'ACTIVE', '2020-11-10T15:58:06.808-05:00'),
                        tokenResultItem('ghfghfghfghf', '0f5cd483-3e0b-4b0c-87ea-1c13f3b358b2', '2020-11-10T15:57:23.762-05:00', 'ACTIVE', '2020-11-09T15:58:06.808-05:00'),
                        tokenResultItem('Anton', '1f4f0233-26fc-4b34-bc7f-b3fcca9a9f5b', '2020-11-10T15:57:23.762-05:00', 'ACTIVE', '2020-11-09T15:58:06.808-05:00'),
                        tokenResultItem('Bill', '12345678-26fc-4b34-bc7f-b3fcca9a9f5b', '2020-11-11T15:57:23.762-05:00', 'ACTIVE', '2020-11-10T15:58:06.808-05:00')
                    ]
                }
            }
        }
    }
};

export const tokenResultBill = {
    data: {
        admin: {
            personalApiTokens: {
                tokens: {
                    pageInfo: {
                        totalCount: 6,
                        nodesCount: 1,
                        startCursor: 'MWI4YzhiMDYtYzliZC00MzE0LWE5ODEtNjhjOGUyZmUxZDNh',
                        endCursor: 'MWY0ZjAyMzMtMjZmYy00YjM0LWJjN2YtYjNmY2NhOWE5ZjVi',
                        hasNextPage: true,
                        hasPreviousPage: false
                    },
                    nodes: [
                        tokenResultItem('Bill', '12345678-26fc-4b34-bc7f-b3fcca9a9f5b', '2020-11-11T15:57:23.762-05:00', '2020-11-10T15:58:06.808-05:00')
                    ]
                }
            }
        }
    }
};

export const createTokenMocks = [
    {
        request: {
            query: GetScopesQuery
        },
        result: () => ({
            data: {
                admin: {
                    personalApiTokens: {
                        availableScopes: [
                            {
                                name: 'graphql',
                                description: 'descr'
                            }
                        ]
                    }
                }
            }
        })
    },
    {
        request: {
            query: CreateTokenMutation,
            variables: {
                name: 'testToken',
                expireAt: expTime,
                scopes: []
            }
        },
        result: () => ({
            data: {
                admin: {
                    personalApiTokens: {
                        createToken: 'tokenWithExpiryDate'
                    }
                }
            }
        })
    },
    {
        request: {
            query: DeleteTokenMutation,
            variables: {
                key: '1b8c8b06-c9bd-4314-a981-68c8e2fe1d3a'
            }
        },
        result: () => ({
            data: {
                admin: {
                    personalApiTokens: {
                        deleteToken: true
                    }
                }
            }
        })
    },
    {
        request: {
            query: getTokens,
            variables: {
                userId: 'root',
                limit: 25,
                offset: 0,
                fieldSorter: {
                    fieldName: 'createdAt',
                    sortType: 'DESC'
                }
            }
        },
        result: () => tokenResult
    },
    {
        request: {
            query: getTokens,
            variables: {
                userId: 'root',
                limit: 25,
                offset: 0,
                fieldSorter: {
                    fieldName: 'createdAt',
                    sortType: 'DESC'
                }
            }
        },
        result: () => tokenResultWithoutTestToken
    },
    {
        request: {
            query: getTokens,
            variables: {
                userId: 'root',
                limit: 25,
                offset: 0,
                fieldSorter: {
                    fieldName: 'createdAt',
                    sortType: 'ASC'
                }
            }
        },
        result: () => tokenResult
    },
    {
        request: {
            query: CreateTokenMutation,
            variables: {
                name: 'testToken',
                scopes: []
            }
        },
        result: () => ({
            data: {
                admin: {
                    personalApiTokens: {
                        createToken: 'tokenNoExpiryDate'
                    }
                }
            }
        })
    },
    {
        request: {
            query: CreateTokenMutation,
            variables: {
                name: 'testToken',
                scopes: ['graphql']
            }
        },
        result: () => ({
            data: {
                admin: {
                    personalApiTokens: {
                        createToken: 'tokenWithScope'
                    }
                }
            }
        })
    },
    {
        request: {
            query: getUserInformation
        },
        result: () => ({
            data: {
                jcr: {
                    nodeByPath: {
                        name: 'root',
                        displayName: 'root'
                    }
                }
            }
        })
    },
    {
        request: {
            query: StateTokenMutation,
            variables: {key: '1b8c8b06-c9bd-4314-a981-68c8e2fe1d3a', state: 'DISABLED'}
        }
    }
];

export const toggleTokenStateMocks = [
    {
        request: {
            query: getTokens,
            variables: {
                userId: 'root',
                limit: 25,
                offset: 0,
                fieldSorter: {
                    fieldName: 'createdAt',
                    sortType: 'DESC'
                }
            }
        },
        result: () => tokenResult
    },
    {
        request: {
            query: getTokens,
            variables: {
                userId: 'root',
                limit: 25,
                offset: 0,
                fieldSorter: {
                    fieldName: 'createdAt',
                    sortType: 'DESC'
                }
            }
        },
        result: () => {
            let updatedResult = {...tokenResult};
            updatedResult.data.admin.personalApiTokens.tokens.nodes[0].state = 'DISABLED';
            return updatedResult;
        }
    },
    {
        request: {
            query: StateTokenMutation,
            variables: {key: '1b8c8b06-c9bd-4314-a981-68c8e2fe1d3a', state: 'DISABLED'}
        },
        result: {
            data: {
                admin: {
                    personalApiTokens: {
                        updateToken: true
                    }
                }
            }
        }
    }
];

export const tokenUserFilterMocks = [
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
        result: () => tokenResultAllUsers
    },
    {
        request: {
            query: getTokens,
            variables: {
                userId: 'bill',
                limit: 25,
                offset: 0,
                fieldSorter: {
                    fieldName: 'createdAt',
                    sortType: 'DESC'
                }
            }
        },
        result: () => tokenResultBill
    },
    {
        request: {
            query: getTokens,
            variables: {
                userId: 'root',
                limit: 25,
                offset: 0,
                fieldSorter: {
                    fieldName: 'createdAt',
                    sortType: 'DESC'
                }
            }
        },
        result: () => tokenResult
    }
];

export const snapshotMocks = [
    {
        request: {
            query: CreateTokenMutation,
            variables: {
                name: 'testToken',
                expireAt: '2020-11-11T02:24:00.000Z',
                scopes: []
            }
        },
        result: () => ({
            data: {
                admin: {
                    personalApiTokens: {
                        createToken: 'tokenWithExpiryDate'
                    }
                }
            }
        })
    },
    {
        request: {
            query: getTokens,
            variables: {
                userId: 'root',
                limit: 25,
                offset: 0,
                fieldSorter: {
                    fieldName: 'createdAt',
                    sortType: 'DESC'
                }
            }
        },
        result: () => ({
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
        })
    },
    {
        request: {
            query: CreateTokenMutation,
            variables: {
                name: 'testToken',
                expireAt: '2020-11-11T07:24:00.000Z',
                scopes: []
            }
        },
        result: () => ({
            data: {
                admin: {
                    personalApiTokens: {
                        createToken: 'tokenWithExpiryDate'
                    }
                }
            }
        })
    },
    {
        request: {
            query: CreateTokenMutation,
            variables: {
                name: 'testToken',
                expireAt: null,
                scopes: []
            }
        },
        result: () => ({
            data: {
                admin: {
                    personalApiTokens: {
                        createToken: 'tokenNoExpiryDate'
                    }
                }
            }
        })
    },
    {
        request: {
            query: getUserInformation
        },
        result: () => ({
            data: {
                jcr: {
                    nodeByPath: {
                        name: 'root',
                        displayName: 'root'
                    }
                }
            }
        })
    }
];
