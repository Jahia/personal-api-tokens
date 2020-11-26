import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {TableCell, TableRow} from '@material-ui/core';
import {Button, Chip, Menu, MenuItem, MoreVert, Typography} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import styles from './TokenTableRow.scss';
import ConfirmationDialog from '../../ConfirmationDialog/ConfirmationDialog';
import dayjs from 'dayjs';

const TokenTableRow = ({token, isMyTokens, deleteToken, changeStateToken, moreActionLabel, deactivateLabel, activateLabel}) => {
    const {t} = useTranslation('personal-api-tokens');

    const [menuOpen, setMenuOpen] = useState({});
    const [anchorEl, setAnchorEl] = useState({});
    const [deleteTokenDialogOpen, setDeleteTokenDialogOpen] = useState(false);

    const handleMenu = (e, tokenName) => {
        setAnchorEl(Object.assign({}, anchorEl, {[tokenName]: e.currentTarget}));
        setMenuOpen(Object.assign({}, menuOpen, {[tokenName]: !menuOpen[tokenName]}));
    };

    const deleteAndCloseDialog = () => {
        setDeleteTokenDialogOpen(false);
        deleteToken(token.key);
    };

    const handleClose = tokenName => {
        setAnchorEl(Object.assign({}, anchorEl, {[tokenName]: null}));
        setMenuOpen(Object.assign({}, menuOpen, {[tokenName]: false}));
    };

    const deleteTokenDialogBody = (
        <Typography className={styles.deleteDialogBody}>{t('personal-api-tokens:deleteToken.deleteWarning')}
            <span className={styles.tokenName}>&nbsp;{token.name}&nbsp;</span><span>?</span>
        </Typography>
    );

    const capitalize = s => {
        if (typeof s !== 'string') {
            return '';
        }

        return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    };

    function isMenuDisplayed() {
        const menuOpenElement = menuOpen[token.name];
        return menuOpenElement !== undefined && menuOpenElement;
    }

    function handleStateToken() {
        handleClose(token.name);
        changeStateToken(token.key, token.state.toLowerCase() === 'active' ? 'DISABLED' : 'ACTIVE');
    }

    return (
        <>
            <TableRow>
                {isMyTokens &&
                <TableCell>
                    <Typography>{token.user.name}</Typography>
                </TableCell>}
                <TableCell>
                    <Typography>{token.name}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{token.key}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{dayjs(token.createdAt).format('MMM DD YYYY')}</Typography>
                </TableCell>
                <TableCell>{token.expireAt !== null &&
                    <Typography>{dayjs(token.expireAt).format('MMM DD YYYY')}</Typography>}
                </TableCell>
                <TableCell>
                    <Chip key="tokenState"
                          label={capitalize(token.state)}
                          color={token.state !== null && token.state.toLowerCase() === 'active' ? 'success' : 'warning'}/>
                </TableCell>
                <TableCell>
                    <div className="flexRow">
                        <Button variant="outlined"
                                color="danger"
                                label={t('personal-api-tokens:delete')}
                                onClick={() => setDeleteTokenDialogOpen(true)}/>
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
                                  onClick={() => handleStateToken()}/>
                    </Menu>
                </TableCell>
            </TableRow>
            <ConfirmationDialog isOpen={deleteTokenDialogOpen}
                                acceptLabel={t('personal-api-tokens:deleteToken.deleteForever')}
                                cancelLabel={t('personal-api-tokens:cancel')}
                                title={t('personal-api-tokens:deleteToken.confirmation')}
                                body={deleteTokenDialogBody}
                                acceptButtonProps={{color: 'danger'}}
                                onClose={() => setDeleteTokenDialogOpen(false)}
                                onAccept={() => deleteAndCloseDialog()}/>
        </>
    );
};

TokenTableRow.propTypes = {
    token: PropTypes.object.isRequired,
    isMyTokens: PropTypes.bool,
    moreActionLabel: PropTypes.string.isRequired,
    deactivateLabel: PropTypes.string.isRequired,
    activateLabel: PropTypes.string.isRequired,
    deleteToken: PropTypes.func.isRequired,
    changeStateToken: PropTypes.func.isRequired
};

export default TokenTableRow;
