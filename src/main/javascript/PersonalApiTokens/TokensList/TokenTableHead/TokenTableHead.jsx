import React from 'react';
import {TableCell, TableHead, TableRow, TableSortLabel} from '@material-ui/core';
import {ASCENDING_SORT, CREATED_AT, EXPIRE_AT, KEY, NAME, STATE, USERNAME} from '../../constants';
import {Typography} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import styles from './TokenTableHead.scss';
import PropTypes from 'prop-types';
import useStore from '../../store/store';
import shallow from 'zustand/shallow';

const TokenTableHead = ({isAllTokensPage, handleSort}) => {
    const {t} = useTranslation('personal-api-tokens');
    const [order, orderBy] = useStore(state => [state.order, state.orderBy], shallow);
    return (
        <TableHead>
            <TableRow>
                {isAllTokensPage &&
                    <TableCell classes={{root: styles.cellFont}}
                               sortDirection={orderBy === USERNAME ? order.toLowerCase() : false}
                    >
                        <TableSortLabel
                active={orderBy === USERNAME}
                classes={{icon: orderBy === USERNAME ? styles.iconActive : styles.icon}}
                direction={orderBy === USERNAME ? order.toLowerCase() : ASCENDING_SORT.toLowerCase()}
                onClick={() => handleSort(USERNAME)}
                        >
                            <Typography isNowrap weight="semiBold">{t('personal-api-tokens:tokensList.username')}</Typography>
                        </TableSortLabel>
                    </TableCell>}
                <TableCell classes={{root: styles.cellFont}}
                           sortDirection={orderBy === NAME ? order.toLowerCase() : false}
                >
                    <TableSortLabel
                        active={orderBy === NAME}
                        classes={{icon: orderBy === NAME ? styles.iconActive : styles.icon}}
                        direction={orderBy === NAME ? order.toLowerCase() : ASCENDING_SORT.toLowerCase()}
                        onClick={() => handleSort(NAME)}
                    >
                        <Typography isNowrap weight="semiBold">{t('personal-api-tokens:tokensList.name')}</Typography>
                    </TableSortLabel>
                </TableCell>
                <TableCell classes={{root: styles.cellFont}}
                           sortDirection={orderBy === KEY ? order.toLowerCase() : false}
                >
                    <TableSortLabel
                        active={orderBy === KEY}
                        classes={{icon: orderBy === KEY ? styles.iconActive : styles.icon}}
                        direction={orderBy === KEY ? order.toLowerCase() : ASCENDING_SORT.toLowerCase()}
                        onClick={() => handleSort(KEY)}
                    >
                        <Typography isNowrap weight="semiBold">{t('personal-api-tokens:tokensList.key')}</Typography>
                    </TableSortLabel>
                </TableCell>
                <TableCell classes={{root: styles.cellFont}}
                           sortDirection={orderBy === CREATED_AT ? order.toLowerCase() : false}
                >
                    <TableSortLabel
                        active={orderBy === CREATED_AT}
                        classes={{icon: orderBy === CREATED_AT ? styles.iconActive : styles.icon}}
                        direction={orderBy === CREATED_AT ? order.toLowerCase() : ASCENDING_SORT.toLowerCase()}
                        onClick={() => handleSort(CREATED_AT)}
                    >
                        <Typography isNowrap weight="semiBold">{t('personal-api-tokens:tokensList.addedOn')}</Typography>
                    </TableSortLabel>
                </TableCell>
                <TableCell classes={{root: styles.cellFont}} sortDirection={orderBy === EXPIRE_AT ? order.toLowerCase() : false}>
                    <TableSortLabel
                        active={orderBy === EXPIRE_AT}
                        classes={{icon: orderBy === EXPIRE_AT ? styles.iconActive : styles.icon}}
                        direction={orderBy === EXPIRE_AT ? order.toLowerCase() : ASCENDING_SORT.toLowerCase()}
                        onClick={() => handleSort(EXPIRE_AT)}
                    >
                        <Typography isNowrap weight="semiBold">{t('personal-api-tokens:tokensList.expiration')}</Typography>
                    </TableSortLabel>
                </TableCell>
                <TableCell classes={{root: styles.cellFont}} sortDirection={orderBy === STATE ? order.toLowerCase() : false}>
                    <TableSortLabel
                        active={orderBy === STATE}
                        classes={{icon: orderBy === STATE ? styles.iconActive : styles.icon}}
                        direction={orderBy === STATE ? order.toLowerCase() : ASCENDING_SORT.toLowerCase()}
                        onClick={() => handleSort(STATE)}
                    >
                        <Typography isNowrap weight="semiBold">{t('personal-api-tokens:tokensList.status')}</Typography>
                    </TableSortLabel>
                </TableCell>
                <TableCell classes={{root: styles.cellFont}}>
                    <Typography isNowrap weight="semiBold">{t('personal-api-tokens:tokensList.actions')}</Typography>
                </TableCell>
            </TableRow>
        </TableHead>
    );
};

TokenTableHead.propTypes = {
    isAllTokensPage: PropTypes.bool,
    handleSort: PropTypes.func.isRequired
};

export default TokenTableHead;
