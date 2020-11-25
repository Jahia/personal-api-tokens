import React from 'react';
import {Table, TableBody} from '@material-ui/core';
import {Pagination} from './Pagination';
import PropTypes from 'prop-types';
import TokenTableHead from '../TokenTableHead/TokenTableHead';
import TokenTableRow from '../TokenTableRow/TokenTableRow';
import {useTranslation} from 'react-i18next';
import {ASCENDING_SORT, DESCENDING_SORT, INITIAL_OFFSET} from '../../constants';
import tableStyles from './TokenTable.scss';
import {useMutation} from '@apollo/react-hooks';
import {DeleteTokenMutation, getTokens, StateTokenMutation} from '../TokensList.gql';

const TokenTable = props => {
    const {t} = useTranslation('personal-api-tokens');

    const [deleteTokenMutation] = useMutation(DeleteTokenMutation, {
        refetchQueries: [{
            query: getTokens, variables: {
                userId: props.user,
                limit: props.rowsPerPage, offset: props.currentPage,
                fieldSorter: {fieldName: props.orderBy, sortType: props.order}
            }
        }]
    });

    const [stateTokenMutation] = useMutation(StateTokenMutation, {
        refetchQueries: [{
            query: getTokens, variables: {
                userId: props.user,
                limit: props.rowsPerPage, offset: props.currentPage,
                fieldSorter: {fieldName: props.orderBy, sortType: props.order}
            }
        }]
    });

    const deleteToken = key => {
        deleteTokenMutation({variables: {key: key}});
    };

    const changeStateToken = (key, state) => {
        stateTokenMutation({variables: {key: key, state: state}});
    };

    const handleSort = orderByProperty => {
        const isAsc = props.orderBy === orderByProperty && props.order === ASCENDING_SORT;
        const sortOrder = isAsc ? DESCENDING_SORT : ASCENDING_SORT;
        props.setOrderBy(orderByProperty);
        props.setOrder(sortOrder);
    };

    const handleChangeRowsPerPage = currentRowsPerPage => {
        props.setRowsPerPage(currentRowsPerPage);
        props.setCurrentPage(INITIAL_OFFSET);
    };

    return (
        <>
            <div className={tableStyles.table}>
                <Table>
                    <TokenTableHead orderBy={props.orderBy} order={props.order} handleSort={handleSort}/>
                    <TableBody>
                        {props.tokensData.nodes.map(token => (
                            <TokenTableRow key={token.name}
                                           token={token}
                                           deleteToken={deleteToken}
                                           changeStateToken={changeStateToken}
                                           moreActionLabel={t('personal-api-tokens:tokensList.moreActions')}
                                           deactivateLabel={t('personal-api-tokens:tokensList.deactivate')}
                                           activateLabel={t('personal-api-tokens:tokensList.activate')}/>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Pagination
                totalCount={props.tokensData.pageInfo.totalCount}
                pageSize={props.rowsPerPage}
                currentPage={props.currentPage}
                labels={{
                    labelRowsPerPage: t('personal-api-tokens:tokensList.pagination.rowsPerPage'),
                    of: t('personal-api-tokens:tokensList.pagination.of')
                }}
                onChangePage={(event, newPage) => props.setCurrentPage(newPage)}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
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
    setOrderBy: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired
};

export default TokenTable;
