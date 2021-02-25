import React, {useEffect} from 'react';
import styles from './TokensList.scss';
import {useQuery} from '@apollo/react-hooks';
import {getTokens} from './TokensList.gql';
import TokenTable from './TokenTable/TokenTable';
import PropTypes from 'prop-types';
import {REFETCHER_MAP, TOKENS_REFETCH_KEY} from '../constants';
import {Typography} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import shallow from 'zustand/shallow';
import useStore from '../store/store';

const TokensList = ({user, noTokensMessage, isAllTokensPage}) => {
    const {t} = useTranslation('personal-api-tokens');
    const [rowsPerPage, currentPage, orderBy, order] = useStore(state => [state.rowsPerPage, state.currentPage, state.orderBy, state.order], shallow);

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
        return (<div className={`${styles.tokensTable} flexFluid flexCol`}/>);
    }

    const tokensData = (!error && data) ? data.admin.personalApiTokens.tokens : {pageInfo: {totalCount: 0}, nodes: []};

    let emptyMessage = noTokensMessage;
    if (error && error.message.indexOf('Unknown user') !== 0) {
        emptyMessage = t('personal-api-tokens:unknownUser');
    } else if (error) {
        emptyMessage = t('personal-api-tokens:error');
    }

    return tokensData.nodes.length > 0 ? (
        <div className={`${styles.tokensTable} flexFluid flexCol`}>
            <TokenTable tokensData={tokensData}
                        isAllTokensPage={isAllTokensPage}
            />
        </div>
    ) : (
        <div className={`${styles.tokensList} flexRow_center alignCenter flexFluid`}>
            <Typography weight="light"
                        variant="subheading"
                        data-testid="no-tokens-message"
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
