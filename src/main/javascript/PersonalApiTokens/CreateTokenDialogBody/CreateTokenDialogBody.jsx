import React from 'react';
import {Typography} from '@jahia/moonstone';
import styles from './CreateTokenDialogBody.scss';
import {TextField} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import {DatePickerField} from './DatePickerField';
import ScopesSelector from '../ScopesSelector/ScopesSelector';

const CreateTokenDialogBody = ({tokenInformation, setTokenInformation, error}) => {
    const {t} = useTranslation('personal-api-tokens');
    const errorMessage = (
        <Typography className={styles.errorMessage} weight="default" variant="body">{t('personal-api-tokens:createToken.tokenAlreadyExists')}
        </Typography>
    );
    return (
        <div className={`${styles.bodyContainer} flexCol`}>
            <Typography className={styles.nameLabel} variant="subheading">
                {t('personal-api-tokens:createToken.name')}
                <span className={styles.asterisk}>*</span>
            </Typography>
            <Typography weight="light" variant="caption">
                {t('personal-api-tokens:createToken.defineName')}
            </Typography>
            <TextField
                error={error}
                value={tokenInformation.name}
                InputProps={{
                    classes: {root: styles.inputStyle, error: styles.inputError, focused: styles.inputFocus, input: styles.text},
                    'data-testid': 'token-name-input',
                    disableUnderline: true
                }}
                onChange={e => setTokenInformation({...tokenInformation, name: e.target.value})}
            />
            <div className={styles.errorDiv}>
                {error ? errorMessage : null}
            </div>
            <Typography className={styles.nameLabel} variant="subheading">
                {t('personal-api-tokens:createToken.expirationDate')}
            </Typography>
            <Typography weight="light" variant="caption">{t('personal-api-tokens:createToken.setDate')}</Typography>
            <DatePickerField
                selectedDateTime={tokenInformation.expireAt}
                onSelectDateTime={value => setTokenInformation({...tokenInformation, expireAt: value})}
            />
            <div className={styles.errorDiv}/>
            <Typography className={styles.nameLabel} variant="subheading">
                {t('personal-api-tokens:createToken.scopes')}
            </Typography>
            <ScopesSelector
                value={tokenInformation.scopes}
                onChange={scopes => setTokenInformation({...tokenInformation, scopes})}
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
