import React from 'react';
import {TableHead, TableSortLabel, TableCell, TableRow} from '@material-ui/core';
import {NAME_PROPERTY, ADDED_ON, EXPIRATION, LAST_ACCESS, KEY_PROPERTY, STATUS} from '../../constants';
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
                           sortDirection={orderBy === NAME_PROPERTY ? order : false}
                >
                    <TableSortLabel
                        active={orderBy === NAME_PROPERTY}
                        classes={{icon: orderBy === NAME_PROPERTY ? styles.iconActive : styles.icon}}
                        direction={orderBy === NAME_PROPERTY ? order : 'asc'}
                        onClick={() => handleSort(NAME_PROPERTY)}
                    >
                        <Typography variant="body" weight="semiBold">{t('personal-api-tokens:tokensList.name')}</Typography>
                    </TableSortLabel>
                </TableCell>
                <TableCell classes={{root: tableStyles.cellFont}}
                           sortDirection={orderBy === KEY_PROPERTY ? order : false}
                >
                    <TableSortLabel
                        active={orderBy === KEY_PROPERTY}
                        classes={{icon: orderBy === KEY_PROPERTY ? styles.iconActive : styles.icon}}
                        direction={orderBy === KEY_PROPERTY ? order : 'asc'}
                        onClick={() => handleSort(KEY_PROPERTY)}
                    >
                        <Typography variant="body" weight="semiBold">{t('personal-api-tokens:tokensList.key')}</Typography>
                    </TableSortLabel>
                </TableCell>
                <TableCell classes={{root: tableStyles.cellFont}}
                           sortDirection={orderBy === ADDED_ON ? order : false}
                >
                    <TableSortLabel
                        active={orderBy === ADDED_ON}
                        classes={{icon: orderBy === ADDED_ON ? styles.iconActive : styles.icon}}
                        direction={orderBy === ADDED_ON ? order : 'asc'}
                        onClick={() => handleSort(ADDED_ON)}
                    >
                        <Typography variant="body" weight="semiBold">{t('personal-api-tokens:tokensList.addedOn')}</Typography>
                    </TableSortLabel>
                </TableCell>
                <TableCell classes={{root: tableStyles.cellFont}} sortDirection={orderBy === LAST_ACCESS ? order : false}>
                    <TableSortLabel
                        active={orderBy === LAST_ACCESS}
                        classes={{icon: orderBy === LAST_ACCESS ? styles.iconActive : styles.icon}}
                        direction={orderBy === LAST_ACCESS ? order : 'asc'}
                        onClick={() => handleSort(LAST_ACCESS)}
                    >
                        <Typography variant="body" weight="semiBold">{t('personal-api-tokens:tokensList.lastAccess')}</Typography>
                    </TableSortLabel>
                </TableCell>
                <TableCell classes={{root: tableStyles.cellFont}} sortDirection={orderBy === EXPIRATION ? order : false}>
                    <TableSortLabel
                        active={orderBy === EXPIRATION}
                        classes={{icon: orderBy === EXPIRATION ? styles.iconActive : styles.icon}}
                        direction={orderBy === EXPIRATION ? order : 'asc'}
                        onClick={() => handleSort(EXPIRATION)}
                    >
                        <Typography variant="body" weight="semiBold">{t('personal-api-tokens:tokensList.expiration')}</Typography>
                    </TableSortLabel>
                </TableCell>
                <TableCell classes={{root: tableStyles.cellFont}} sortDirection={orderBy === STATUS ? order : false}>
                    <TableSortLabel
                        active={orderBy === STATUS}
                        classes={{icon: orderBy === STATUS ? styles.iconActive : styles.icon}}
                        direction={orderBy === STATUS ? order : 'asc'}
                        onClick={() => handleSort(STATUS)}
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
