import React, {useState} from 'react';
import {Typography} from '@jahia/moonstone';
import styles from './TokensList.scss';
import {useTranslation} from 'react-i18next';
import {useQuery} from '@apollo/react-hooks';
import {getTokens} from './TokensList.gql';
import TokenTable from './TokenTable/TokenTable';
import {CREATED_AT, DESCENDING_SORT, INITIAL_OFFSET, INITIAL_TOKEN_LIMIT} from '../constants';

const TokensList = () => {
    const {t} = useTranslation('personal-api-tokens');
    const [rowsPerPage, setRowsPerPage] = useState(INITIAL_TOKEN_LIMIT);
    const [currentPage, setCurrentPage] = useState(INITIAL_OFFSET);
    const [order, setOrder] = useState(DESCENDING_SORT);
    const [orderBy, setOrderBy] = useState(CREATED_AT);

    const {loading, error, data} = useQuery(getTokens, {
        fetchPolicy: 'network-only',
        variables: {limit: rowsPerPage, offset: currentPage * rowsPerPage,
            fieldSorter: {fieldName: orderBy, sortType: order}}});

    if (error || (loading && !data)) {
        return (<div className={styles.tokensTable}/>);
    }

    const noTokensScreen = (
        <div className={styles.tokensList}>
            <Typography className={styles.personalTokens}
                        variant="heading"
                        weight="semiBold"
            >{(t('personal-api-tokens:personalTokens'))}
            </Typography>
            <Typography className={styles.noTokens} weight="light" variant="subheading">{(t('personal-api-tokens:noTokens'))}</Typography>
        </div>
    );

    const tokensData = data ? data.admin.personalApiTokens.tokens : {pageInfo: {totalCount: 0}, nodes: []};

    const tokensTable = (
        <div className={styles.tokensTable}>
            <TokenTable tokensData={tokensData}
                        rowsPerPage={rowsPerPage}
                        currentPage={currentPage}
                        setRowsPerPage={setRowsPerPage}
                        setCurrentPage={setCurrentPage}
                        order={order}
                        orderBy={orderBy}
                        setOrder={setOrder}
                        setOrderBy={setOrderBy}/>
        </div>
    );

    return (
        <>
            {data && data.admin.personalApiTokens.tokens.pageInfo.totalCount ? tokensTable : noTokensScreen}
        </>
    );
};

export default TokensList;
