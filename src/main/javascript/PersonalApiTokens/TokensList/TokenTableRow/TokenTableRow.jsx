import React from 'react';
import PropTypes from 'prop-types';
import {TableCell, TableRow} from '@material-ui/core';
import {Button, Chip, Menu, MenuItem, MoreVert, Typography} from '@jahia/moonstone';
import Moment from 'react-moment';
import {useTranslation} from 'react-i18next';
import styles from './TokenTableRow.scss';

const TokenTableRow = ({token, deleteToken, moreActionLabel, deactivateLabel, activateLabel}) => {
    const {t} = useTranslation('personal-api-tokens');

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
        const menuOpenElement = menuOpen[token.name];
        return menuOpenElement !== undefined && menuOpenElement;
    }

    return (
        <TableRow>
            <TableCell>
                <Typography>{token.name}</Typography>
            </TableCell>
            <TableCell>
                <Typography>{token.key}</Typography>
            </TableCell>
            <TableCell>
                <Typography><Moment format="MMM Do YYYY" date={token.createdAt}/></Typography>
            </TableCell>
            <TableCell>{token.expireAt !== null &&
            <Typography><Moment calendar date={token.expireAt}/></Typography>}
            </TableCell>
            <TableCell>
                <Chip key="tokenState"
                      label={token.state}
                      color={token.state !== null && token.state.toLowerCase() === 'active' ? 'success' : 'warning'}/>
            </TableCell>
            <TableCell>
                <div className="flexRow">
                    <Button variant="outlined"
                            color="danger"
                            label={t('personal-api-tokens:delete')}
                            onClick={() => deleteToken(token.key)}/>
                    <Button icon={<MoreVert/>}
                            variant="ghost"
                            onClick={e => handleMenu(e, token.name)}/>
                </div>
                <Menu isDisplayed={isMenuDisplayed()}
                      anchorEl={anchorEl[token.name]}
                      anchorPosition={{top: 0, left: 0}}
                      anchorElOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left'
                      }}
                      transformElOrigin={{
                          vertical: 'top',
                          horizontal: 'left'
                      }}
                      onClose={() => handleClose(token.name)}
                >
                    <MenuItem label={moreActionLabel}
                              variant="title"/>
                    <MenuItem label={token.state.toLowerCase() === 'active' ? deactivateLabel : activateLabel}
                              className={token.state.toLowerCase() === 'active' ? styles.remove : ''}
                              onClick={() => console.log('Deactivate')}/>
                </Menu>
            </TableCell>
        </TableRow>
    );
};

TokenTableRow.propTypes = {
    token: PropTypes.object.isRequired,
    moreActionLabel: PropTypes.string.isRequired,
    deactivateLabel: PropTypes.string.isRequired,
    activateLabel: PropTypes.string.isRequired,
    deleteToken: PropTypes.func.isRequired
};

export default TokenTableRow;
