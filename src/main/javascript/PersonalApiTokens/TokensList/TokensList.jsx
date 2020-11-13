import React, {useState} from 'react';
import {Typography} from '@jahia/moonstone';
import styles from './TokensList.scss';
import {useTranslation} from 'react-i18next';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {getTokens} from './TokensList.gql';
import TokenTable from './TokenTable/TokenTable';
import {ADDED_ON, DEFAULT_SORT_DIR, INITIAL_OFFSET, INITIAL_TOKEN_LIMIT, POLL_INTERVAL} from '../constants';

const TokensList = () => {
    const {t} = useTranslation('personal-api-tokens');
    const [tokensData, setTokensData] = useState({pageInfo: {totalCount: 0}, nodes: []});
    const [rowsPerPage, setRowsPerPage] = useState(INITIAL_TOKEN_LIMIT);
    const [currentPage, setCurrentPage] = useState(INITIAL_OFFSET);

    const updateTokens = data => {
        const tokenData = data.admin.personalApiTokens.tokens;
        if (tokenData) {
            setTokensData(tokenData);
        }
    };

    const [getTokensPaginated] = useLazyQuery(getTokens, {onCompleted: updateTokens});

    useQuery(getTokens, {
        onCompleted: updateTokens,
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
        pollInterval: POLL_INTERVAL,
        variables: {limit: rowsPerPage, offset: currentPage * rowsPerPage, order: DEFAULT_SORT_DIR, orderBy: ADDED_ON}});

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

    const tokensTable = (
        <div className={styles.tokensTable}>
            <TokenTable tokensData={tokensData}
                        getTokensPaginated={getTokensPaginated}
                        rowsPerPage={rowsPerPage}
                        currentPage={currentPage}
                        setRowsPerPage={setRowsPerPage}
                        setCurrentPage={setCurrentPage}/>
        </div>
    );

    return (
        <>
            {tokensData.pageInfo.totalCount ? tokensTable : noTokensScreen}
        </>
    );
};

export default TokensList;
