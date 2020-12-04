import React from 'react';
import styles from './CopyTokenDialogBody.scss';
import {Button, Copy, Typography} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';

const CopyTokenDialogBody = ({tokenValue}) => {
    const {t} = useTranslation('personal-api-tokens');

    return (
        <div className={`${styles.bodyContainer} flexCol`}>
            <Typography variant="subheading">{t('personal-api-tokens:copyToken.warningNotToShareToken')}
            </Typography>
            <div className={`${styles.copyContainer} flexRow_between`}>
                <Typography variant="subheading">{t('personal-api-tokens:copyToken.copyToClipboard')}</Typography>
                <Button variant="outlined"
                        label={t('personal-api-tokens:copyToken.copy')}
                        icon={<Copy/>}
                        color="accent"
                        onClick={() => copy(tokenValue)}/>
            </div>
            <Typography className={styles.secretKeyWarning}>{t('personal-api-tokens:copyToken.warningToCopyToken')}</Typography>
            <div className={`${styles.tokenContainer} flexRow_center alignCenter`}>
                <Typography weight="bold" data-testid="token-value">{tokenValue}</Typography>
            </div>
        </div>
    );
};

CopyTokenDialogBody.propTypes = {
    tokenValue: PropTypes.string.isRequired
};

export default CopyTokenDialogBody;
