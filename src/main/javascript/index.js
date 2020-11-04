import './PersonalApiTokens';
import {registry} from '@jahia/ui-extender';

registry.add('callback', 'personal-api-tokens', {
    targets: ['jahiaApp-init:99'],
    callback: () => Promise.all([
        window.jahia.i18n.loadNamespaces('personal-api-tokens')
    ])
});
