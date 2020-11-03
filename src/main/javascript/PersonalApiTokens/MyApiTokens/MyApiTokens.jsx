import React, {Suspense} from 'react';
import {useTranslation} from 'react-i18next';
import {Add, Button, GlobalStyle, Typography} from '@jahia/moonstone';
import TokensList from '../TokensList/TokensList';
import styles from './MyApiTokens.scss';

const MyApiTokens = () => {
    const {t} = useTranslation('personal-api-tokens');
    return (
        <Suspense fallback="loading ...">
            <GlobalStyle/>
            <div className={styles.root}>
                <div className={styles.headerRoot}>
                    <header className={styles.header}>
                        <Typography variant="title"
                                    weight="semiBold"
                        >{t('personal-api-tokens:title')}
                        </Typography>
                        <div className={styles.actionBar}>
                            <Button size="big"
                                    color="accent"
                                    label={t('personal-api-tokens:create')}
                                    icon={<Add/>}
                                    onClick={() => {
                                    }}/>
                        </div>
                    </header>
                </div>
                <div className={styles.content}>
                    <TokensList/>
                </div>
            </div>
        </Suspense>
    );
};

export default MyApiTokens;
