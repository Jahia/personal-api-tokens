import React from 'react';
import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MyApiTokens from '../../../main/javascript/PersonalApiTokens/MyApiTokens/MyApiTokens';
import {createTokenMocks} from '../apolloMocks';
import {MockedProvider, wait} from '@apollo/react-testing';

const dialogRole = 'dialog';

async function openDeleteTokenDialog() {
    const deleteTokenButtons = screen.queryAllByText(/translated_personal-api-tokens:delete/i);
    expect(deleteTokenButtons).toHaveLength(5);
    expect(screen.queryAllByRole(dialogRole)).toHaveLength(0);
    await act(async () => {
        fireEvent.click(deleteTokenButtons[0]);
        await wait(200);
    });
}

describe('Test token deletion', () => {
    afterEach(() => {
        cleanup();
    });

    beforeEach(async () => {
        render(
            <MockedProvider mocks={createTokenMocks} addTypename={false}>
                <MyApiTokens/>
            </MockedProvider>
        );
        await act(async () => {
            await wait(200);
        });
    });

    test('test that token is deleted properly when clicking on a button', async () => {
        await openDeleteTokenDialog();
        expect(screen.queryAllByRole(dialogRole)).toHaveLength(1);
        const confirmationHeader = screen.getByText(/translated_personal-api-tokens:deleteToken.confirmation/i);
        expect(confirmationHeader).toBeDefined();
        const deleteWarning = screen.getByText(/translated_personal-api-tokens:deleteToken.deleteWarning/i);
        expect(deleteWarning).toBeDefined();
        const deleteForeverButton = screen.getByText(/translated_personal-api-tokens:deleteToken.deleteForever/i);
        expect(deleteForeverButton).toBeDefined();
        // Should be two elements, one for table and one for dialog
        const tokenNameElements = screen.queryAllByText(/TestToken/i);
        expect(tokenNameElements).toHaveLength(2);
        await act(async () => {
            fireEvent.click(deleteForeverButton);
            await wait(400);
        });
        const testTokenElements = screen.queryAllByText(/TestToken/i);
        expect(testTokenElements).toHaveLength(0);
    });

    test('test cancel buttons are working', async () => {
        await openDeleteTokenDialog();
        expect(screen.queryAllByRole(dialogRole)).toHaveLength(1);
        // Should be two elements, one for table and one for dialog
        const cancelButton = screen.getByText(/translated_personal-api-tokens:cancel/i);
        await act(async () => {
            fireEvent.click(cancelButton);
            await wait(200);
        });
        expect(screen.queryAllByRole(dialogRole)).toHaveLength(0);
        await openDeleteTokenDialog();
        expect(screen.queryAllByRole(dialogRole)).toHaveLength(1);
        const buttons = screen.getAllByRole('button');
        await act(async () => {
            // First button is close icon button, can't query it by text, it's svg
            fireEvent.click(buttons[0]);
            await wait(200);
        });
        expect(screen.queryAllByRole(dialogRole)).toHaveLength(0);
    });
});
