import React, {useState, useEffect} from 'react';
import styles from './TokensList.scss';
import {useQuery} from '@apollo/react-hooks';
import {getTokens} from './TokensList.gql';
import TokenTable from './TokenTable/TokenTable';
import PropTypes from 'prop-types';
import {
    CREATED_AT,
    DESCENDING_SORT,
    INITIAL_OFFSET,
    INITIAL_TOKEN_LIMIT,
    REFETCHER_MAP,
    TOKENS_REFETCH_KEY
} from '../constants';
import {Typography} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';

const TokensList = ({user, noTokensMessage, isAllTokensPage}) => {
    const {t} = useTranslation('personal-api-tokens');
    const [rowsPerPage, setRowsPerPage] = useState(INITIAL_TOKEN_LIMIT);
    const [currentPage, setCurrentPage] = useState(INITIAL_OFFSET);
    const [order, setOrder] = useState(DESCENDING_SORT);
    const [orderBy, setOrderBy] = useState(CREATED_AT);

    const {loading, error, data, refetch} = useQuery(getTokens, {
        fetchPolicy: 'network-only',
        variables: {
            userId: user, limit: rowsPerPage, offset: currentPage * rowsPerPage,
            fieldSorter: {fieldName: orderBy, sortType: order}
        }
    });

    useEffect(() => {
        REFETCHER_MAP.set(TOKENS_REFETCH_KEY, refetch);
        return () => {
            REFETCHER_MAP.delete(TOKENS_REFETCH_KEY);
        };
    }, [refetch]);

    if (loading && !data) {
        return (<div className={styles.tokensTable}/>);
    }

    const tokensData = (!error && data) ? data.admin.personalApiTokens.tokens : {pageInfo: {totalCount: 0}, nodes: []};

    let emptyMessage = noTokensMessage;
    if (error && error.message.indexOf('Unknown user') !== 0) {
        emptyMessage = t('personal-api-tokens:unknownUser');
    } else if (error) {
        emptyMessage = t('personal-api-tokens:error');
    }

    return tokensData.nodes.length > 0 ? (
        <div className={styles.tokensTable}>
            <TokenTable tokensData={tokensData}
                        rowsPerPage={rowsPerPage}
                        currentPage={currentPage}
                        setRowsPerPage={setRowsPerPage}
                        setCurrentPage={setCurrentPage}
                        order={order}
                        orderBy={orderBy}
                        setOrder={setOrder}
                        setOrderBy={setOrderBy}
                        isAllTokensPage={isAllTokensPage}
            />
        </div>
    ) : (
        <div className={styles.tokensList}>
            <Typography className={styles.noTokens}
                        weight="light"
                        variant="subheading"
            >{emptyMessage}
            </Typography>
        </div>
    );
};

export default TokensList;

TokensList.propTypes = {
    user: PropTypes.string,
    noTokensMessage: PropTypes.string,
    isAllTokensPage: PropTypes.bool
};
