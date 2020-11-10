import React from 'react';
import {act, cleanup, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MyApiTokens from '../../../main/javascript/PersonalApiTokens/MyApiTokens/MyApiTokens';
import {createTokenMocks} from '../apolloMocks';
import {MockedProvider, wait} from '@apollo/react-testing';

describe('Test main screen functionality', () => {
    afterEach(() => {
        cleanup();
    });

    test('test screen without any tokens', async () => {
        render(
            <MockedProvider mocks={createTokenMocks} addTypename={false}>
                <MyApiTokens/>
            </MockedProvider>
        );
        await act(async () => {
            await wait(0);
        });
        const noTokensText = screen.getByText(/translated_personal-api-tokens:noTokens/i);
        expect(noTokensText).toBeDefined();
    });
});
