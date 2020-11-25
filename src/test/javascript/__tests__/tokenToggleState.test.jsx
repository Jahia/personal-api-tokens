import React from 'react';
import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MyApiTokens from '../../../main/javascript/PersonalApiTokens/MyApiTokens/MyApiTokens';
import {toggleTokenStateMocks} from '../apolloMocks';
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

describe('Test token toggling state', () => {
    afterEach(() => {
        cleanup();
    });

    test('Verify token can be disabled', async () => {
        const {container} = render(
            <MockedProvider mocks={toggleTokenStateMocks} addTypename={false}>
                <MyApiTokens/>
            </MockedProvider>
        );
        await act(async () => {
            await wait(200);
        });
        const deleteTokenButtons = await screen.findAllByRole('button', {name: /translated_personal-api-tokens:delete/i});
        let menuButton = deleteTokenButtons[0].nextSibling;
        expect(menuButton).toBeDefined();
        await act(async () => {
            fireEvent.click(menuButton);
        });
        expect(container).toMatchSnapshot();
        const deactivateTokenButton = screen.getAllByText(/translated_personal-api-tokens:tokensList.deactivate/i);
        expect(deactivateTokenButton[0]).toBeVisible();
        expect(deactivateTokenButton[1]).not.toBeVisible();
        await act(async () => {
            fireEvent.click(deactivateTokenButton[0]);
            await wait(100);
        });
        let disabled = await screen.findAllByRole('cell', {name: /DISABLED/i});
        expect(disabled).toHaveLength(1);
    }, 30000);
});
