import React from 'react';
import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MyApiTokens from '../../../main/javascript/PersonalApiTokens/MyApiTokens/MyApiTokens';
import {createTokenMocks} from '../apolloMocks';
import {MockedProvider, wait} from '@apollo/react-testing';

function testTableHeaders() {
    const nameTableHeader = screen.getByText(/translated_personal-api-tokens:tokensList.name/i);
    expect(nameTableHeader).toBeDefined();
    const keyTableHeader = screen.getByText(/translated_personal-api-tokens:tokensList.key/i);
    expect(keyTableHeader).toBeDefined();
    const addedTableHeader = screen.getByText(/translated_personal-api-tokens:tokensList.addedOn/i);
    expect(addedTableHeader).toBeDefined();
    const expirationTableHeader = screen.getByText(/translated_personal-api-tokens:tokensList.expiration/i);
    expect(expirationTableHeader).toBeDefined();
    const statusTableHeader = screen.getByText(/translated_personal-api-tokens:tokensList.status/i);
    expect(statusTableHeader).toBeDefined();
    const actionsTableHeader = screen.getByText(/translated_personal-api-tokens:tokensList.actions/i);
    expect(actionsTableHeader).toBeDefined();
}

describe('Test main screen functionality', () => {
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

    test('test screen with tokens that proper table is rendered', async () => {
        const noTokensText = screen.queryAllByText(/translated_personal-api-tokens:noTokens/i);
        expect(noTokensText).toEqual([]);
        // Test table and correct headers are present
        const table = screen.getByRole('table');
        expect(table).toBeDefined();
        testTableHeaders();
        // Test correct number of rows based on default pagination
        const tableRows = table.getElementsByTagName('tr');
        expect(tableRows).toHaveLength(6);
        // Test sorting behaviour
        const activeSortLabelElement = table.getElementsByClassName('MuiTableSortLabel-active');
        expect(activeSortLabelElement).toHaveLength(1);
        const sortHeaderSpan = activeSortLabelElement[0];
        expect(sortHeaderSpan.getElementsByClassName('MuiTableSortLabel-iconDirectionDesc')).toHaveLength(1);
        expect(sortHeaderSpan.children[0].innerHTML).toEqual('translated_personal-api-tokens:tokensList.addedOn');
        await act(async () => {
            fireEvent.click(sortHeaderSpan);
            await wait(200);
        });
        expect(sortHeaderSpan.getElementsByClassName('MuiTableSortLabel-iconDirectionAsc')).toHaveLength(1);
        expect(sortHeaderSpan.children[0].innerHTML).toEqual('translated_personal-api-tokens:tokensList.addedOn');
    });
});
