import React from 'react';
import {act, cleanup, render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {useSelector} from 'react-redux';
import MyApiTokens from '../../../main/javascript/PersonalApiTokens/MyApiTokens/MyApiTokens';
import {createTokenMocks} from '../apolloMocks';
import {MockedProvider, wait} from '@apollo/react-testing';

jest.mock('react-router', () => {
    return {
        useHistory: jest.fn(() => {
        })
    };
});

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

describe('Validate main screen snapshot', () => {
    beforeEach(() => {
        useSelector.mockImplementation(callback => {
            return callback({uilang: 'en'});
        });
    });
    afterEach(() => {
        useSelector.mockClear();
        cleanup();
    });

    test('match snapshot', async () => {
        const {container} = render(
            <MockedProvider mocks={createTokenMocks} addTypename={false}>
                <MyApiTokens/>
            </MockedProvider>
        );
        await act(async () => {
            await wait(0);
        });
        expect(container).toMatchSnapshot();
    });
});

