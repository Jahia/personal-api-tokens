import React, {useState} from 'react';
import {Table, TableBody, TablePagination} from '@material-ui/core';
import PropTypes from 'prop-types';
import TokenTableHead from '../TokenTableHead/TokenTableHead';
import TokenTableRow from '../TokenTableRow/TokenTableRow';
import {useTranslation} from 'react-i18next';
import {ADDED_ON, DEFAULT_SORT_DIR, INITIAL_OFFSET} from '../../constants';
import tableStyles from './TokenTable.scss';

const TokenTable = ({tokensData, getTokensPaginated, rowsPerPage, setRowsPerPage, currentPage, setCurrentPage}) => {
    const {t} = useTranslation('personal-api-tokens');

    const [order, setOrder] = useState(DEFAULT_SORT_DIR);
    const [orderBy, setOrderBy] = useState(ADDED_ON);

    const handleSort = async orderByProperty => {
        const isAsc = orderBy === orderByProperty && order === 'asc';
        const sortOrder = isAsc ? 'desc' : 'asc';
        setOrderBy(orderByProperty);
        setOrder(sortOrder);
        await getTokensPaginated({variables: {limit: rowsPerPage, offset: INITIAL_OFFSET, order: order, orderBy: orderBy}});
    };

    const handleChangePage = async (event, newPage) => {
        await getTokensPaginated({variables: {limit: rowsPerPage, offset: newPage * rowsPerPage, order: order, orderBy: orderBy}});
        setCurrentPage(newPage);
    };

    const handleChangeRowsPerPage = async event => {
        const currentRowsPerPage = parseInt(event.target.value, 10);
        await getTokensPaginated({variables: {limit: currentRowsPerPage, offset: INITIAL_OFFSET, order: order, orderBy: orderBy}});
        setRowsPerPage(currentRowsPerPage);
        setCurrentPage(INITIAL_OFFSET);
    };

    return (
        <>
            <Table>
                <TokenTableHead orderBy={orderBy} order={order} handleSort={handleSort}/>
                <TableBody>
                    {tokensData.nodes.map(token => (
                        <TokenTableRow key={token.name}
                                       token={token}
                                       moreActionLabel={t('personal-api-tokens:tokensList.moreActions')}
                                       deactivateLabel={t('personal-api-tokens:tokensList.deactivate')}/>
                ))}
                </TableBody>
            </Table>
            <TablePagination
                classes={{caption: tableStyles.cellFont, select: tableStyles.cellFont, menuItem: tableStyles.cellFont}}
                count={tokensData.pageInfo.totalCount}
                page={currentPage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}/>
        </>
    );
};

TokenTable.propTypes = {
    tokensData: PropTypes.object.isRequired,
    getTokensPaginated: PropTypes.func.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    setRowsPerPage: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    setCurrentPage: PropTypes.func.isRequired
};

export default TokenTable;
