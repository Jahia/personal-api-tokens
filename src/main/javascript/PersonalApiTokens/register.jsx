import React from 'react';
import {registry} from '@jahia/ui-extender';
import MyApiTokens from './MyApiTokens/MyApiTokens';
import {Lock} from '@jahia/moonstone';
import UserApiTokens from './UserApiTokens/UserApiTokens';

export const registerPersonalApiTokens = () => {
    registry.add('adminRoute', 'personal-api-tokens', {
        targets: ['dashboard:99.1'],
        // Icon is Lock as of now, will be changed to proper one after moonstone release
        icon: <Lock/>,
        label: 'personal-api-tokens:title',
        isSelectable: true,
        render: () => <MyApiTokens/>
    });

    registry.add('adminRoute', 'pat', {
        targets: ['administration-server-usersAndRoles:45'],
        label: 'personal-api-tokens:adminTitle',
        isSelectable: true,
        render: () => <UserApiTokens/>
    });
};
