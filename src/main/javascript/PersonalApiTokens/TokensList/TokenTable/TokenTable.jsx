import React from 'react';
import {Table, TableBody, TablePagination} from '@material-ui/core';
import PropTypes from 'prop-types';
import TokenTableHead from '../TokenTableHead/TokenTableHead';
import TokenTableRow from '../TokenTableRow/TokenTableRow';
import {useTranslation} from 'react-i18next';
import {ASCENDING_SORT, DESCENDING_SORT, INITIAL_OFFSET} from '../../constants';
import tableStyles from './TokenTable.scss';
import {useMutation} from '@apollo/react-hooks';
import {DeleteTokenMutation, getTokens} from '../TokensList.gql';

const TokenTable = props => {
    const {t} = useTranslation('personal-api-tokens');

    const [deleteTokenMutation] = useMutation(DeleteTokenMutation, {
        refetchQueries: [{query: getTokens, variables: {limit: props.rowsPerPage, offset: props.currentPage,
            fieldSorter: {fieldName: props.orderBy, sortType: props.order}}}]
    });

    const deleteToken = key => {
        deleteTokenMutation({variables: {key: key}});
    };

    const handleSort = orderByProperty => {
        const isAsc = props.orderBy === orderByProperty && props.order === ASCENDING_SORT;
        const sortOrder = isAsc ? DESCENDING_SORT : ASCENDING_SORT;
        props.setOrderBy(orderByProperty);
        props.setOrder(sortOrder);
    };

    const handleChangeRowsPerPage = event => {
        const currentRowsPerPage = parseInt(event.target.value, 10);
        props.setRowsPerPage(currentRowsPerPage);
        props.setCurrentPage(INITIAL_OFFSET);
    };

    return (
        <>
            <Table>
                <TokenTableHead orderBy={props.orderBy} order={props.order} handleSort={handleSort}/>
                <TableBody>
                    {props.tokensData.nodes.map(token => (
                        <TokenTableRow key={token.name}
                                       token={token}
                                       deleteToken={deleteToken}
                                       moreActionLabel={t('personal-api-tokens:tokensList.moreActions')}
                                       deactivateLabel={t('personal-api-tokens:tokensList.deactivate')}
                                       activateLabel={t('personal-api-tokens:tokensList.activate')}/>
                ))}
                </TableBody>
            </Table>
            <TablePagination
                classes={{caption: tableStyles.cellFont, select: tableStyles.cellFont, menuItem: tableStyles.cellFont}}
                count={props.tokensData.pageInfo.totalCount}
                page={props.currentPage}
                rowsPerPage={props.rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                onChangePage={(event, newPage) => props.setCurrentPage(newPage)}
                onChangeRowsPerPage={handleChangeRowsPerPage}/>
        </>
    );
};

TokenTable.propTypes = {
    tokensData: PropTypes.object.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    setRowsPerPage: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    setOrder: PropTypes.func.isRequired,
    setOrderBy: PropTypes.func.isRequired
};

export default TokenTable;
