import React from 'react';
import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MyApiTokens from '../../../main/javascript/PersonalApiTokens/MyApiTokens/MyApiTokens';
import {createTokenMocks} from '../apolloMocks';
import {MockedProvider, wait} from '@apollo/react-testing';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        pathname: 'localhost:3000/example/path'
    })
}));

global.contextJsParameters = {
    user: {
        username: 'root'
    }
};

describe('Test token creation', () => {
    beforeEach(async () => {
        render(
            <MockedProvider mocks={createTokenMocks} addTypename={false}>
                <MyApiTokens/>
            </MockedProvider>
        );

        const createTokenButton = screen.getByText(/translated_personal-api-tokens:createToken.buttonTitle/i);
        expect(createTokenButton).toBeDefined();
        await act(async () => {
            fireEvent.click(createTokenButton);
            await wait(300);
        });
    });
    afterEach(() => {
        cleanup();
    });

    test('test that create token button opens modal for token creation', async () => {
        expect(screen.getByText(/translated_personal-api-tokens:createToken.expirationDate/i)).toBeDefined();
        expect(screen.getByText(/translated_personal-api-tokens:cancel/i)).toBeDefined();
        expect(screen.getByText(/translated_personal-api-tokens:createToken.modalTitle/i)).toBeDefined();
        expect(screen.getByText(/translated_personal-api-tokens:createToken.name/i)).toBeDefined();
        expect(screen.getByText(/translated_personal-api-tokens:createToken.defineName/i)).toBeDefined();
    });

    test('Verify token creation with name and redirection from create token modal to token created modal', async () => {
        const createButton = screen.getByText(/translated_personal-api-tokens:create$/i);
        expect(screen.getByText(/translated_personal-api-tokens:create$/i)).toBeDefined();
        const tokenNameInput = screen.getAllByRole('textbox')[0];
        const tokenExpiryDateInput = screen.getAllByRole('textbox')[1];
        await act(async () => {
            fireEvent.change(tokenNameInput, {target: {value: 'testToken'}});
            await wait(200);
            fireEvent.change(tokenExpiryDateInput, {target: {value: '2020/11/11 02:24'}});
            fireEvent.click(createButton);
            await wait(500);
        });
        // Check that token is displayed
        expect(screen.getByText(/tokenWithExpiryDate/i)).toBeDefined();
        const copyToClipboardButton = screen.getAllByRole('button')[1];
        document.execCommand = jest.fn();
        window.prompt = jest.fn();
        await act(async () => {
            fireEvent.click(copyToClipboardButton);
            await wait(300);
        });
        expect(document.execCommand).toHaveBeenCalledWith('copy');
        expect(screen.getByText(/translated_personal-api-tokens:copyToken.copyToClipboard/i)).toBeDefined();
    });

    test('Verify token creation without expiration date', async () => {
        const createButton = screen.getByText(/translated_personal-api-tokens:create$/i);
        expect(screen.getByText(/translated_personal-api-tokens:create$/i)).toBeDefined();
        const tokenNameInput = screen.getAllByRole('textbox')[0];
        const tokenExpiryDateInput = screen.getAllByRole('textbox')[1];
        await act(async () => {
            fireEvent.change(tokenNameInput, {target: {value: 'testToken'}});
            await wait(100);
            fireEvent.change(tokenExpiryDateInput, {target: {value: ''}});
            fireEvent.click(createButton);
            await wait(300);
        });
        // Check that token is displayed
        expect(screen.getByText(/tokenNoExpiryDate/i)).toBeDefined();
    });
});
