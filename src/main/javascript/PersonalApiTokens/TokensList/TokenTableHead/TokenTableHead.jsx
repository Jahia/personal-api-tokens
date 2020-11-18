import React from 'react';
import {TableHead, TableSortLabel, TableCell, TableRow} from '@material-ui/core';
import {NAME, CREATED_AT, EXPIRE_AT, KEY, STATE, ASCENDING_SORT} from '../../constants';
import {Typography} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import styles from './TokenTableHead.scss';
import PropTypes from 'prop-types';
import tableStyles from '../TokenTable/TokenTable.scss';

const TokenTableHead = ({orderBy, order, handleSort}) => {
    const {t} = useTranslation('personal-api-tokens');
    return (
        <TableHead>
            <TableRow>
                <TableCell classes={{root: tableStyles.cellFont}}
                           sortDirection={orderBy === NAME ? order.toLowerCase() : false}
                >
                    <TableSortLabel
                        active={orderBy === NAME}
                        classes={{icon: orderBy === NAME ? styles.iconActive : styles.icon}}
                        direction={orderBy === NAME ? order.toLowerCase() : ASCENDING_SORT.toLowerCase()}
                        onClick={() => handleSort(NAME)}
                    >
                        <Typography variant="body" weight="semiBold">{t('personal-api-tokens:tokensList.name')}</Typography>
                    </TableSortLabel>
                </TableCell>
                <TableCell classes={{root: tableStyles.cellFont}}
                           sortDirection={orderBy === KEY ? order.toLowerCase() : false}
                >
                    <TableSortLabel
                        active={orderBy === KEY}
                        classes={{icon: orderBy === KEY ? styles.iconActive : styles.icon}}
                        direction={orderBy === KEY ? order.toLowerCase() : ASCENDING_SORT.toLowerCase()}
                        onClick={() => handleSort(KEY)}
                    >
                        <Typography variant="body" weight="semiBold">{t('personal-api-tokens:tokensList.key')}</Typography>
                    </TableSortLabel>
                </TableCell>
                <TableCell classes={{root: tableStyles.cellFont}}
                           sortDirection={orderBy === CREATED_AT ? order.toLowerCase() : false}
                >
                    <TableSortLabel
                        active={orderBy === CREATED_AT}
                        classes={{icon: orderBy === CREATED_AT ? styles.iconActive : styles.icon}}
                        direction={orderBy === CREATED_AT ? order.toLowerCase() : ASCENDING_SORT.toLowerCase()}
                        onClick={() => handleSort(CREATED_AT)}
                    >
                        <Typography variant="body" weight="semiBold">{t('personal-api-tokens:tokensList.addedOn')}</Typography>
                    </TableSortLabel>
                </TableCell>
                <TableCell classes={{root: tableStyles.cellFont}} sortDirection={orderBy === EXPIRE_AT ? order.toLowerCase() : false}>
                    <TableSortLabel
                        active={orderBy === EXPIRE_AT}
                        classes={{icon: orderBy === EXPIRE_AT ? styles.iconActive : styles.icon}}
                        direction={orderBy === EXPIRE_AT ? order.toLowerCase() : ASCENDING_SORT.toLowerCase()}
                        onClick={() => handleSort(EXPIRE_AT)}
                    >
                        <Typography variant="body" weight="semiBold">{t('personal-api-tokens:tokensList.expiration')}</Typography>
                    </TableSortLabel>
                </TableCell>
                <TableCell classes={{root: tableStyles.cellFont}} sortDirection={orderBy === STATE ? order.toLowerCase() : false}>
                    <TableSortLabel
                        active={orderBy === STATE}
                        classes={{icon: orderBy === STATE ? styles.iconActive : styles.icon}}
                        direction={orderBy === STATE ? order.toLowerCase() : ASCENDING_SORT.toLowerCase()}
                        onClick={() => handleSort(STATE)}
                    >
                        <Typography variant="body" weight="semiBold">{t('personal-api-tokens:tokensList.status')}</Typography>
                    </TableSortLabel>
                </TableCell>
                <TableCell classes={{root: tableStyles.cellFont}}>
                    <Typography variant="body" weight="semiBold">{t('personal-api-tokens:tokensList.actions')}</Typography>
                </TableCell>
            </TableRow>
        </TableHead>
    );
};

TokenTableHead.propTypes = {
    orderBy: PropTypes.string.isRequired,
    order: PropTypes.string.isRequired,
    handleSort: PropTypes.func.isRequired
};

export default TokenTableHead;