import React from 'react';
import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserApiTokens from '../../../main/javascript/PersonalApiTokens/UserApiTokens/UserApiTokens';
import {MockedProvider, wait} from '@apollo/react-testing';
import {tokenUserFilterMocks} from '../apolloMocks';

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
            <MockedProvider mocks={tokenUserFilterMocks} addTypename={false}>
                <UserApiTokens/>
            </MockedProvider>
        );
        await act(async () => {
            await wait(0);
        });
    });

    afterEach(() => {
        cleanup();
    });

    it('filter on user name', async () => {
        const searchInput = screen.getByRole('textbox');
        const createButton = screen.getAllByRole('button')[0];

        const tables = screen.getAllByRole('table');
        expect(tables.length).toBe(2);
        const table = tables[0];
        const tableRows = table.getElementsByTagName('tr');

        expect(tableRows).toHaveLength(7);

        await act(async () => {
            fireEvent.change(searchInput, {target: {value: 'bill'}});
            fireEvent.click(createButton);
            await wait(0);
        });

        console.log(tableRows.length);
        expect(tableRows).toHaveLength(2);

        await act(async () => {
            fireEvent.change(searchInput, {target: {value: 'root'}});
            fireEvent.click(createButton);
            await wait(0);
        });

        console.log(tableRows.length);
        expect(tableRows).toHaveLength(6);
    });
});
