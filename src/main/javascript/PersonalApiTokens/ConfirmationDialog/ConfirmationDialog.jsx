import React from 'react';
import PropTypes from 'prop-types';
import styles from './ConfirmationDialog.scss';
import {Button, Close, Typography} from '@jahia/moonstone';
import {Dialog} from '@material-ui/core';

const ConfirmationDialog = props => {
    return (
        <Dialog fullWidth
                disableAutoFocus
                maxWidth="sm"
                open={props.isOpen}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                onClose={props.onClose}
        >
            <div className={`${styles.modal} flexCol`}>
                <div className={`${styles.header} flexRow_between alignCenter`}>
                    <Typography variant="heading" data-testid="dialog-header">{props.title}</Typography>
                    <Button icon={<Close/>}
                            variant="ghost"
                            onClick={props.onClose}/>
                </div>
                {props.body}
                <div className={`${styles.footer} flexRow_reverse`}>
                    {props.cancelLabel ? <Button variant="ghost"
                                                 size="big"
                                                 color="default"
                                                 data-testid="close-dialog-btn"
                                                 label={props.cancelLabel}
                                                 onClick={props.onClose}/> : ''}
                    <Button variant="default"
                            data-testid="accept-dialog-btn"
                            size="big"
                            label={props.acceptLabel}
                            color="accent"
                            onClick={props.onAccept}
                            {...props.acceptButtonProps}/>
                </div>
            </div>
        </Dialog>
    );
};

ConfirmationDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    acceptLabel: PropTypes.string.isRequired,
    cancelLabel: PropTypes.string,
    title: PropTypes.string.isRequired,
    onAccept: PropTypes.func.isRequired,
    body: PropTypes.element.isRequired,
    acceptButtonProps: PropTypes.object
};

export default ConfirmationDialog;
