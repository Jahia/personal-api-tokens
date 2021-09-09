import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Add, Button, Header} from '@jahia/moonstone';
import TokensList from '../TokensList/TokensList';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';
import CreateTokenDialogBody from '../CreateTokenDialogBody/CreateTokenDialogBody';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import CopyTokenDialogBody from '../CopyTokenDialogBody/CopyTokenDialogBody';
import {CreateTokenMutation} from './MyApiTokens.gql';
import {useMutation} from '@apollo/react-hooks';
import {ContentLayout} from '@jahia/moonstone-alpha';
import {REFETCHER_MAP, TOKENS_REFETCH_KEY} from '../constants';

dayjs.extend(utc);

const USER_TOKEN_INFO_EMPTY = {name: '', scopes: []};

const MyApiTokens = () => {
    const {t} = useTranslation('personal-api-tokens');

    const [isCreateTokenDialogOpen, setCreateTokenDialogOpen] = useState(false);
    const [isCopyTokenDialogOpen, setCopyTokenDialogOpen] = useState(false);
    const [createTokenError, setCreateTokenError] = useState(false);
    const [userTokenInformation, setUserTokenInformation] = useState(USER_TOKEN_INFO_EMPTY);
    const [tokenValue, setTokenValue] = useState('');

    const refreshState = () => {
        setCreateTokenError(false);
        setUserTokenInformation({...userTokenInformation, name: ''});
        setTokenValue('');
    };

    const updateTokenValue = data => {
        setCreateTokenDialogOpen(false);
        setCopyTokenDialogOpen(true);
        const tokenData = data.admin.personalApiTokens.createToken;
        setTokenValue(tokenData ? tokenData : '');
        setUserTokenInformation(USER_TOKEN_INFO_EMPTY);
        return REFETCHER_MAP.get(TOKENS_REFETCH_KEY)?.call();
    };

    const [createTokenMutation] = useMutation(CreateTokenMutation, {
        onCompleted: updateTokenValue,
        onError: err => {
            console.log(err);
            setCreateTokenError(true);
        },
        variables: userTokenInformation
    });

    return (
        <ContentLayout
            paper
            header={(
                <div style={{backgroundColor: 'white'}}>
                    <Header
                        title={t('personal-api-tokens:title')}
                        mainActions={[
                            <Button key="create"
                                    size="big"
                                    color="accent"
                                    data-testid="create-token-btn"
                                    label={t('personal-api-tokens:createToken.buttonTitle')}
                                    icon={<Add/>}
                                    onClick={() => {
                                        refreshState();
                                        setCreateTokenDialogOpen(true);
                                    }}/>
                        ]}
                    />
                </div>
            )}
            content={(
                <>
                    <ConfirmationDialog isOpen={isCreateTokenDialogOpen}
                                        acceptLabel={t('personal-api-tokens:create')}
                                        cancelLabel={t('personal-api-tokens:cancel')}
                                        title={t('personal-api-tokens:createToken.modalTitle')}
                                        body={<CreateTokenDialogBody
                                            tokenInformation={userTokenInformation}
                                            setTokenInformation={setUserTokenInformation}
                                            error={createTokenError}
                                        />}
                                        acceptButtonProps={{isDisabled: userTokenInformation.name === ''}}
                                        onClose={() => setCreateTokenDialogOpen(false)}
                                        onAccept={() => createTokenMutation()}/>
                    <ConfirmationDialog isOpen={isCopyTokenDialogOpen}
                                        acceptLabel={t('personal-api-tokens:close')}
                                        title={t('personal-api-tokens:copyToken.title')}
                                        body={<CopyTokenDialogBody tokenValue={tokenValue}/>}
                                        onClose={() => setCopyTokenDialogOpen(false)}
                                        onAccept={() => setCopyTokenDialogOpen(false)}/>
                    <TokensList user={window.contextJsParameters.user.username} noTokensMessage={t('personal-api-tokens:noTokens')}/>
                </>
            )}
        />
    );
};

export default MyApiTokens;
