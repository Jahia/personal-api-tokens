import {registry} from '@jahia/ui-extender';
import register from './PersonalApiTokens.register';

export default function () {
    window.jahia.i18n.loadNamespaces('personal-api-tokens');

    registry.add('callback', 'personal-api-tokens', {
        targets: ['jahiaApp-init:99'],
        callback: register
    });
}
