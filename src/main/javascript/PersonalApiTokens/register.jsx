import React from 'react';
import {registry} from '@jahia/ui-extender';
import MyApiTokens from './MyApiTokens/MyApiTokens';
import {Lock} from '@jahia/moonstone';

export const registerPersonalApiTokens = () => {
    registry.add('adminRoute', 'personal-api-tokens', {
        targets: ['dashboard:99.1'],
        // Icon is Lock as of now, will be changed to proper one after moonstone release
        icon: <Lock/>,
        label: 'personal-api-tokens:title',
        isSelectable: true,
        render: () => <MyApiTokens/>
    });
};
