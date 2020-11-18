import React from 'react';
import {Typography} from '@jahia/moonstone';
import styles from './CreateTokenDialogBody.scss';
import {TextField} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';

const CreateTokenDialogBody = ({tokenInformation, setTokenInformation, error}) => {
    const {t} = useTranslation('personal-api-tokens');
    const errorMessage = (
        <Typography className={styles.errorMessage} weight="default" variant="body">{t('personal-api-tokens:createToken.tokenAlreadyExists')}
        </Typography>
    );
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
                error={error}
                value={tokenInformation.name}
                InputProps={{
                    classes: {root: styles.inputStyle, error: styles.inputError, focused: styles.inputFocus, input: styles.text},
                    disableUnderline: true
                }}
                onChange={e => setTokenInformation({...tokenInformation, name: e.target.value})}
            />
            {error ? errorMessage : null}
            <Typography className={styles.nameLabel}
                        variant="subheading"
            >{t('personal-api-tokens:createToken.expirationDate')}
            </Typography>
            <Typography weight="light" variant="caption">{t('personal-api-tokens:createToken.setDate')}</Typography>
            <TextField
                value={tokenInformation.expireAt}
                onChange={e => setTokenInformation({...tokenInformation, expireAt: e.target.value})}
            />
        </div>
    );
};

CreateTokenDialogBody.propTypes = {
    tokenInformation: PropTypes.object.isRequired,
    setTokenInformation: PropTypes.func.isRequired,
    // eslint-disable-next-line react/boolean-prop-naming
    error: PropTypes.bool.isRequired
};

export default CreateTokenDialogBody;
