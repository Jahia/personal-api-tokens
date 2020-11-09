import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Add, Button, GlobalStyle, Typography} from '@jahia/moonstone';
import TokensList from '../TokensList/TokensList';
import styles from './MyApiTokens.scss';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';
import CreateTokenDialogBody from '../CreateTokenDialogBody/CreateTokenDialogBody';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import CopyTokenDialogBody from '../CopyTokenDialogBody/CopyTokenDialogBody';
import {createToken, getCurrentUserName} from './MyApiTokens.gql';
import {useMutation, useQuery} from '@apollo/react-hooks';

const MyApiTokens = () => {
    const {t} = useTranslation('personal-api-tokens');
    const [isCreateTokenDialogOpen, setCreateTokenDialogOpen] = useState(false);
    const [isCopyTokenDialogOpen, setCopyTokenDialogOpen] = useState(false);
    const [userTokenInformation, setUserTokenInformation] = useState({expireAt: moment().add(1, 'days')});
    const [tokenValue, setTokenValue] = useState('tokenendfjdjfdfj');

    const updateCurrentUser = data => {
        setUserTokenInformation({...userTokenInformation, userId: data.currentUser.name});
    };

    useQuery(getCurrentUserName, {
        onCompleted: updateCurrentUser
    });

    const updateTokenValue = data => {
        const tokenData = data.admin.personalApiTokens.createToken;
        setTokenValue(tokenData ? tokenData : '');
    };

    const [createTokenMutation] = useMutation(createToken, {
        onCompleted: updateTokenValue,
        variables: userTokenInformation
    });

    const createTokenHandler = async () => {
        await createTokenMutation();
        setCreateTokenDialogOpen(false);
        setCopyTokenDialogOpen(true);
    };

    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
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
                                    label={t('personal-api-tokens:createToken.buttonTitle')}
                                    icon={<Add/>}
                                    onClick={() => {
                                        setCreateTokenDialogOpen(true);
                                    }}/>
                        </div>
                    </header>
                </div>
                <div className={styles.content}>
                    <ConfirmationDialog isOpen={isCreateTokenDialogOpen}
                                        acceptLabel={t('personal-api-tokens:create')}
                                        cancelLabel={t('personal-api-tokens:cancel')}
                                        title={t('personal-api-tokens:createToken.modalTitle')}
                                        body={<CreateTokenDialogBody
                                            tokenInformation={userTokenInformation}
                                            setTokenInformation={setUserTokenInformation}
                                        />}
                                        onClose={() => setCreateTokenDialogOpen(false)}
                                        onAccept={() => createTokenHandler()}/>
                    <ConfirmationDialog isOpen={isCopyTokenDialogOpen}
                                        acceptLabel={t('personal-api-tokens:close')}
                                        title={t('personal-api-tokens:copyToken.title')}
                                        body={<CopyTokenDialogBody tokenValue={tokenValue}/>}
                                        onClose={() => setCopyTokenDialogOpen(false)}
                                        onAccept={() => setCopyTokenDialogOpen(false)}/>
                    <TokensList/>
                </div>
            </div>
        </MuiPickersUtilsProvider>
    );
};

export default MyApiTokens;
