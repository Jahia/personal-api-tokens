import React from 'react';
import {Typography} from '@jahia/moonstone';
import styles from './TokensList.scss';
import {useTranslation} from 'react-i18next';

const TokensList = () => {
    const {t} = useTranslation('personal-api-tokens');
    return (
        <>
            <div className={styles.tokensList}>
                <Typography className={styles.personalTokens}
                            variant="heading"
                            weight="semiBold"
                >{(t('personal-api-tokens:personalTokens'))}
                </Typography>
                <Typography className={styles.noTokens}
                            weight="light"
                            variant="subheading"
                >{(t('personal-api-tokens:noTokens'))}
                </Typography>
            </div>
        </>
    );
};

export default TokensList;
