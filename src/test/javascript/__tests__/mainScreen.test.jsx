import React from 'react';
import {act, cleanup, render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {useSelector} from 'react-redux';
import MyApiTokens from '../../../main/javascript/PersonalApiTokens/MyApiTokens/MyApiTokens';

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

describe('Test main screen functionality', () => {
    beforeEach(() => {
        useSelector.mockImplementation(callback => {
            return callback({uilang: 'en'});
        });
    });
    afterEach(() => {
        useSelector.mockClear();
        cleanup();
    });

    test('test screen without any tokens', async () => {
        render(
            <MyApiTokens/>
        );
        const createTokenButton = screen.getByText(/translated_personal-api-tokens:create/i);
        expect(createTokenButton).toBeDefined();
        await act(async () => {
            // Nothing is happening as API still not wired
            fireEvent.click(createTokenButton);
        });
        expect(createTokenButton).toBeDefined();
        const noTokensText = screen.getByText(/translated_personal-api-tokens:noTokens/i);
        expect(noTokensText).toBeDefined();
    });
});
