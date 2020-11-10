import React from 'react';
import {act, cleanup, render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MyApiTokens from '../../../main/javascript/PersonalApiTokens/MyApiTokens/MyApiTokens';
import {createTokenMocks} from '../apolloMocks';
import {MockedProvider, wait} from '@apollo/react-testing';

describe('Validate main screen snapshot', () => {
    afterEach(() => {
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

