// Used only if personal-api-token is the host, experimental
import('@jahia/app-shell/bootstrap').then(res => {
    window.jahia = res;
    res.startAppShell(window.appShell.remotes, window.appShell.targetId);
});
