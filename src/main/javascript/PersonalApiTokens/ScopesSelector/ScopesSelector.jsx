import React, {useEffect, useMemo} from 'react';
import {Checkbox, Table, TableBody, TableBodyCell, TableHead, TableHeadCell, TableRow} from '@jahia/moonstone';
import {useFlexLayout, useRowSelect, useTable} from 'react-table';
import styles from './ScopesSelector.scss';
import {useQuery} from '@apollo/react-hooks';
import {GetScopesQuery} from './ScopesSelector.gql';
import PropTypes from 'prop-types';

const columns = [
    {
        id: 'selection',
        Header: header => <Checkbox isUncontrolled {...header.getToggleAllRowsSelectedProps()}/>,
        Cell: cellInfo => <Checkbox isUncontrolled {...cellInfo.row.getToggleRowSelectedProps()}/>,
        width: 52,
        canResize: false
    },
    {
        id: 'name',
        Header: 'Scope',
        width: 100,
        accessor: row => row.name
    },
    {
        id: 'description',
        Header: 'Description',
        accessor: row => row.description
    }
];

const ScopesSelector = ({value, onChange}) => {
    const {data} = useQuery(GetScopesQuery);
    const tableData = useMemo(
        () => (data && data.admin) ? data.admin.personalApiTokens.availableScopes : [],
        [data]
    );

    const initialState = {
        selectedRowIds: value.reduce((acc, v) => Object.assign(acc, {[tableData.map(t => t.name).indexOf(v)]: true}), {})
    };

    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, selectedFlatRows} =
        useTable({
            data: tableData,
            columns,
            initialState
        }, useRowSelect, useFlexLayout);

    useEffect(() => {
        onChange(selectedFlatRows.map(s => s.original.name));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFlatRows]);

    return (
        <div className={styles.outerDiv}>
            <div className={styles.tableDiv}>
                <Table {...getTableProps()} className={styles.table}>
                    <TableHead className={styles.tableHead}>
                        {headerGroups.map(headerGroup => (
                            // A key is included in headerGroup.getHeaderGroupProps
                            // eslint-disable-next-line react/jsx-key
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    // A key is included in column.getHeaderProps
                                    // eslint-disable-next-line react/jsx-key
                                    <TableHeadCell {...column.getHeaderProps()}>
                                        {column.render('Header')}
                                    </TableHeadCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody {...getTableBodyProps()}>
                        {rows.map(row => {
                            prepareRow(row);
                            return (
                                // A key is included in row.getRowProps
                                // eslint-disable-next-line react/jsx-key
                                <TableRow
                                    isSelected={row.isSelected}
                                    {...row.getRowProps()}
                                >
                                    {row.cells.map(cell => (
                                        // A key is included in cell.getCellProps
                                        // eslint-disable-next-line react/jsx-key
                                        <TableBodyCell {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </TableBodyCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

ScopesSelector.propTypes = {
    value: PropTypes.array,

    onChange: PropTypes.func
};

export default ScopesSelector;
