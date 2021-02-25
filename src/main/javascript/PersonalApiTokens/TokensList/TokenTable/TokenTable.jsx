import React from 'react';
import {Table, TableBody} from '@material-ui/core';
import {Pagination} from './Pagination';
import PropTypes from 'prop-types';
import TokenTableHead from '../TokenTableHead/TokenTableHead';
import TokenTableRow from '../TokenTableRow/TokenTableRow';
import {useTranslation} from 'react-i18next';
import {ASCENDING_SORT, DESCENDING_SORT, INITIAL_OFFSET, REFETCHER_MAP, TOKENS_REFETCH_KEY} from '../../constants';
import tableStyles from './TokenTable.scss';
import {useMutation} from '@apollo/react-hooks';
import {DeleteTokenMutation, StateTokenMutation} from '../TokensList.gql';
import useStore from '../../store/store';
import shallow from 'zustand/shallow';

const TokenTable = props => {
    const {t} = useTranslation('personal-api-tokens');
    const [rowsPerPage, currentPage, orderBy, order] = useStore(state =>
        [state.rowsPerPage, state.currentPage, state.orderBy, state.order], shallow);
    const [setRowsPerPage, setCurrentPage, setOrderBy, setOrder] = useStore(state =>
        [state.setRowsPerPage, state.setCurrentPage, state.setOrderBy, state.setOrder], shallow);

    const refreshList = () => REFETCHER_MAP.get(TOKENS_REFETCH_KEY)?.call();

    const [deleteTokenMutation] = useMutation(DeleteTokenMutation, {
        onCompleted: refreshList
    });

    const [stateTokenMutation] = useMutation(StateTokenMutation, {
        onCompleted: refreshList
    });

    const deleteToken = key => {
        deleteTokenMutation({variables: {key: key}});
    };

    const changeStateToken = (key, state) => {
        stateTokenMutation({variables: {key: key, state: state}});
    };

    const handleSort = orderByProperty => {
        const isAsc = orderBy === orderByProperty && order === ASCENDING_SORT;
        const sortOrder = isAsc ? DESCENDING_SORT : ASCENDING_SORT;
        setOrderBy(orderByProperty);
        setOrder(sortOrder);
    };

    const handleChangeRowsPerPage = currentRowsPerPage => {
        setRowsPerPage(currentRowsPerPage);
        setCurrentPage(INITIAL_OFFSET);
    };

    return (
        <>
            <div className={`${tableStyles.table} flexFluid`}>
                <Table>
                    <TokenTableHead isAllTokensPage={props.isAllTokensPage} handleSort={handleSort}/>
                    <TableBody>
                        {props.tokensData.nodes.map(token => (
                            <TokenTableRow key={token.name}
                                           token={token}
                                           isAllTokensPage={props.isAllTokensPage}
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
                pageSize={rowsPerPage}
                currentPage={currentPage}
                labels={{
                    labelRowsPerPage: t('personal-api-tokens:tokensList.pagination.rowsPerPage'),
                    of: t('personal-api-tokens:tokensList.pagination.of')
                }}
                onChangePage={(event, newPage) => setCurrentPage(newPage)}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </>
    );
};

TokenTable.propTypes = {
    tokensData: PropTypes.object.isRequired,
    isAllTokensPage: PropTypes.bool
};

export default TokenTable;
