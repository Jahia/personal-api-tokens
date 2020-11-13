import React from 'react';
import PropTypes from 'prop-types';
import {capitalize, TableCell, TableRow} from '@material-ui/core';
import {Chip, Button, Menu, MenuItem, MoreVert, Typography} from '@jahia/moonstone';
import Moment from 'react-moment';
import {useTranslation} from 'react-i18next';
import styles from './TokenTableRow.scss';
import {useMutation} from '@apollo/react-hooks';
import {CreateTokenMutation} from '../../MyApiTokens/MyApiTokens.gql';
import tableStyles from '../TokenTable/TokenTable.scss';

const TokenTableRow = props => {
    const {t} = useTranslation('personal-api-tokens');

    const [deleteToken] = useMutation(CreateTokenMutation, {
        variables: {key: props.token.key}
    });

    const [menuOpen, setMenuOpen] = React.useState({});
    const [anchorEl, setAnchorEl] = React.useState({});

    const handleMenu = (e, tokenName) => {
        setAnchorEl(Object.assign({}, anchorEl, {[tokenName]: e.currentTarget}));
        setMenuOpen(Object.assign({}, menuOpen, {[tokenName]: !menuOpen[tokenName]}));
    };

    const handleClose = tokenName => {
        setAnchorEl(Object.assign({}, anchorEl, {[tokenName]: null}));
        setMenuOpen(Object.assign({}, menuOpen, {[tokenName]: false}));
    };

    function isMenuDisplayed() {
        const menuOpenElement = menuOpen[props.token.name];
        return menuOpenElement !== undefined && menuOpenElement;
    }

    return (
        <TableRow>
            <TableCell classes={{root: tableStyles.cellFont}}>
                <Typography>{props.token.name}</Typography>
            </TableCell>
            <TableCell classes={{root: tableStyles.cellFont}}>
                <Typography>{props.token.key}</Typography>
            </TableCell>
            <TableCell classes={{root: tableStyles.cellFont}}>
                <Typography><Moment format="MMM Do YYYY" date={props.token.createdAt}/></Typography>
            </TableCell>
            <TableCell classes={{root: tableStyles.cellFont}}>{props.token.lastUsedAt !== null &&
            <Typography><Moment calendar date={props.token.lastUsedAt}/></Typography>}
            </TableCell>
            <TableCell classes={{root: tableStyles.cellFont}}>{props.token.expireAt !== null &&
            <Typography><Moment calendar date={props.token.expireAt}/></Typography>}
            </TableCell>
            <TableCell classes={{root: tableStyles.cellFont}}>
                <Chip key="tokenState"
                      label={capitalize(props.token.state.toLowerCase())}
                      color={props.token.state !== null && props.token.state.toLowerCase() === 'active' ? 'success' : 'warning'}/>
            </TableCell>
            <TableCell classes={{root: tableStyles.cellFont}}>
                <div className={styles.header}>
                    <Button variant="outlined"
                            color="danger"
                            size="big"
                            label={t('personal-api-tokens:delete')}
                            onClick={() => deleteToken}/>
                    <Button icon={<MoreVert/>}
                            variant="ghost"
                            size="big"
                            onClick={e => handleMenu(e, props.token.name)}/>
                </div>
                <Menu isDisplayed={isMenuDisplayed()}
                      anchorEl={anchorEl[props.token.name]}
                      anchorPosition={{top: 0, left: 0}}
                      anchorElOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left'
                      }}
                      transformElOrigin={{
                          vertical: 'top',
                          horizontal: 'left'
                      }}
                      onClose={() => handleClose(props.token.name)}
                >
                    <MenuItem label={props.moreActionLabel}
                              variant="title"/>
                    <MenuItem label={props.deactivateLabel}
                              isDisabled={props.token.state === 'DISABLED'}
                              className={styles.remove}
                              onClick={() => console.log('Deactivate')}/>
                </Menu>
            </TableCell>
        </TableRow>
    );
};

TokenTableRow.propTypes = {
    token: PropTypes.object.isRequired,
    moreActionLabel: PropTypes.string.isRequired,
    deactivateLabel: PropTypes.string.isRequired
};

export default TokenTableRow;
