import React from 'react';
import {TableCell, TableHead, TableRow, TableSortLabel} from '@material-ui/core';
import {ASCENDING_SORT, CREATED_AT, EXPIRE_AT, KEY, USERNAME, NAME, STATE} from '../../constants';
import {Typography} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import styles from './TokenTableHead.scss';
import PropTypes from 'prop-types';

const TokenTableHead = ({user, orderBy, order, handleSort}) => {
    const {t} = useTranslation('personal-api-tokens');
    return (
        <TableHead>
            <TableRow>
                {user !== window.contextJsParameters.user.username &&
                    <TableCell classes={{root: styles.cellFont}}
                               sortDirection={orderBy === USERNAME ? order.toLowerCase() : false}
                    >
                        <TableSortLabel
                active={orderBy === USERNAME}
                classes={{icon: orderBy === USERNAME ? styles.iconActive : styles.icon}}
                direction={orderBy === USERNAME ? order.toLowerCase() : ASCENDING_SORT.toLowerCase()}
                onClick={() => handleSort(USERNAME)}
                        >
                            <Typography variant="body" weight="semiBold">{t('personal-api-tokens:tokensList.username')}</Typography>
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
                        <Typography variant="body" weight="semiBold">{t('personal-api-tokens:tokensList.name')}</Typography>
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
                        <Typography variant="body" weight="semiBold">{t('personal-api-tokens:tokensList.key')}</Typography>
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
                        <Typography variant="body" weight="semiBold">{t('personal-api-tokens:tokensList.addedOn')}</Typography>
                    </TableSortLabel>
                </TableCell>
                <TableCell classes={{root: styles.cellFont}} sortDirection={orderBy === EXPIRE_AT ? order.toLowerCase() : false}>
                    <TableSortLabel
                        active={orderBy === EXPIRE_AT}
                        classes={{icon: orderBy === EXPIRE_AT ? styles.iconActive : styles.icon}}
                        direction={orderBy === EXPIRE_AT ? order.toLowerCase() : ASCENDING_SORT.toLowerCase()}
                        onClick={() => handleSort(EXPIRE_AT)}
                    >
                        <Typography variant="body" weight="semiBold">{t('personal-api-tokens:tokensList.expiration')}</Typography>
                    </TableSortLabel>
                </TableCell>
                <TableCell classes={{root: styles.cellFont}} sortDirection={orderBy === STATE ? order.toLowerCase() : false}>
                    <TableSortLabel
                        active={orderBy === STATE}
                        classes={{icon: orderBy === STATE ? styles.iconActive : styles.icon}}
                        direction={orderBy === STATE ? order.toLowerCase() : ASCENDING_SORT.toLowerCase()}
                        onClick={() => handleSort(STATE)}
                    >
                        <Typography variant="body" weight="semiBold">{t('personal-api-tokens:tokensList.status')}</Typography>
                    </TableSortLabel>
                </TableCell>
                <TableCell classes={{root: styles.cellFont}}>
                    <Typography variant="body" weight="semiBold">{t('personal-api-tokens:tokensList.actions')}</Typography>
                </TableCell>
            </TableRow>
        </TableHead>
    );
};

TokenTableHead.propTypes = {
    user: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    order: PropTypes.string.isRequired,
    handleSort: PropTypes.func.isRequired
};

export default TokenTableHead;
