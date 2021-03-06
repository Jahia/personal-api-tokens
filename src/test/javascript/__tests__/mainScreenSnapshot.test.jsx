import React from 'react';
import {act, cleanup, render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MyApiTokens from '../../../main/javascript/PersonalApiTokens/MyApiTokens/MyApiTokens';
import {snapshotMocks} from '../apolloMocks';
import {MockedProvider, wait} from '@apollo/react-testing';

global.contextJsParameters = {
    user: {
        username: 'root'
    }
};

describe('Validate main screen snapshot', () => {
    afterEach(() => {
        cleanup();
    });
    test('match snapshot', async () => {
        const {container} = render(
            <MockedProvider mocks={snapshotMocks} addTypename={false}>
                <MyApiTokens/>
            </MockedProvider>
        );
        await act(async () => {
            await wait(0);
        });
        expect(container).toMatchSnapshot();
    });
});

