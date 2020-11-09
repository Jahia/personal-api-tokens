import React from 'react';
import {Typography} from '@jahia/moonstone';
import styles from './CreateTokenDialogBody.scss';
import {TextField} from '@material-ui/core';
import {KeyboardDateTimePicker} from '@material-ui/pickers';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';

const CreateTokenDialogBody = ({tokenInformation, setTokenInformation}) => {
    const {t} = useTranslation('personal-api-tokens');
    return (
        <div className={styles.bodyContainer}>
            <Typography className={styles.nameLabel}
                        variant="subheading"
            >{t('personal-api-tokens:createToken.name')}
                <span className={styles.asterisk}>*</span>
            </Typography>
            <Typography weight="light"
                        variant="caption"
            >{t('personal-api-tokens:createToken.defineName')}
            </Typography>
            <TextField
                required
                value={tokenInformation.name}
                InputProps={{
                    classes: {root: styles.inputStyle, focused: styles.inputFocus, input: styles.text},
                    disableUnderline: true
                }}
                onChange={e => setTokenInformation({...tokenInformation, name: e.target.value})}
            />
            <Typography className={styles.nameLabel}
                        variant="subheading"
            >{t('personal-api-tokens:createToken.expirationDate')}
            </Typography>
            <Typography weight="light" variant="caption">{t('personal-api-tokens:createToken.setDate')}</Typography>
            <KeyboardDateTimePicker disablePast
                                    disableToolbar
                                    format="yyyy/MM/DD HH:mm"
                                    value={tokenInformation.expireAt}
                                    ampm={false}
                                    InputProps={{
                                        classes: {root: styles.inputStyle, focused: styles.inputFocus, input: styles.text},
                                        disableUnderline: true
                                    }}
                                    onChange={date => setTokenInformation({...tokenInformation, expireAt: date})}/>
        </div>
    );
};

CreateTokenDialogBody.propTypes = {
    tokenInformation: PropTypes.object.isRequired,
    setTokenInformation: PropTypes.func.isRequired
};

export default CreateTokenDialogBody;
