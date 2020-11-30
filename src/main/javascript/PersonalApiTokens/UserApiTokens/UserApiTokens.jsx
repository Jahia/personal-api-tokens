import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Search, Typography} from '@jahia/moonstone';
import TokensList from '../TokensList/TokensList';
import {ContentHeader, ContentLayout} from '@jahia/moonstone-alpha';
import {TextField} from '@material-ui/core/index';
import style from './UserApiTokens.scss';

const UserApiTokens = () => {
    const {t} = useTranslation('personal-api-tokens');
    const [user, setUser] = useState();
    const inputRef = useRef();

    const username = user === '' ? null : user;
    return (
        <ContentLayout
            paper
            header={(
                <ContentHeader
                    upperSection={(
                        <Typography variant="title">
                            {t('personal-api-tokens:adminTitle')}
                        </Typography>
                    )}
                />
            )}
            content={(
                <div className="flexCol flexFluid">
                    <div className={`flexRow ${style.search}`}>
                        <TextField
                            placeholder={t('personal-api-tokens:searchPlaceholder')}
                            InputProps={{
                                'data-testid': 'search-user-input',
                                classes: {root: style.input, input: style.text},
                                inputRef,
                                disableUnderline: true,
                                startAdornment: (
                                    <div className={style.icon}>
                                        <Search/>
                                    </div>
                                )
                            }}
                            onKeyPress={event => {
                                if (event.key === 'Enter') {
                                    setUser(inputRef.current.value);
                                }
                            }}
                        />
                        <Button color="accent"
                                data-testid="search-user-btn"
                                label={t('personal-api-tokens:search')}
                                variant="outlined"
                                onClick={() => setUser(inputRef.current.value)}
                        />
                    </div>
                    <TokensList isAllTokensPage user={username} noTokensMessage={username ? t('personal-api-tokens:noTokensForUser', {name: username}) : t('personal-api-tokens:noTokensAtAll')}/>
                </div>
            )}
        />
    );
};

export default UserApiTokens;
