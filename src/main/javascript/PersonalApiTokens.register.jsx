import {registry} from '@jahia/ui-extender';
import Key from './PersonalApiTokens/KeyIcon/KeyIcon';
import MyApiTokens from './PersonalApiTokens/MyApiTokens/MyApiTokens';
import UserApiTokens from './PersonalApiTokens/UserApiTokens/UserApiTokens';
import React from 'react';

export default function () {
    registry.add('adminRoute', 'personal-api-tokens', {
        targets: ['dashboard:99.1'],
        // Icon is Lock as of now, will be changed to proper one after moonstone release
        icon: <Key/>,
        label: 'personal-api-tokens:title',
        isSelectable: true,
        requiredPermission: 'personal-api-tokens',
        render: () => <MyApiTokens/>
    });

    registry.add('adminRoute', 'pat', {
        targets: ['administration-server-usersAndRoles:45'],
        label: 'personal-api-tokens:adminTitle',
        isSelectable: true,
        requiredPermission: 'admin-personal-api-tokens',
        render: () => <UserApiTokens/>
    });
}
