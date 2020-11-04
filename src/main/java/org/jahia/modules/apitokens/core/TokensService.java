package org.jahia.modules.apitokens.core;

import org.jahia.api.content.JCRTemplate;
import org.jahia.api.usermanager.JahiaUserManagerService;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.util.Date;

@Component(immediate = true, service = TokensService.class)
public class TokensService {

    private JCRTemplate jcrTemplate;
    private JahiaUserManagerService userManagerService;

    @Reference
    public void setJcrTemplate(JCRTemplate jcrTemplate) {
        this.jcrTemplate = jcrTemplate;
    }

    @Reference
    public void setUserManagerService(JahiaUserManagerService userManagerService) {
        this.userManagerService = userManagerService;
    }

    public String createToken(String userId, String name, Date expirationDate, boolean active) {
        // todo implement something real
        return TokenUtils.getInstance().generateToken();
    }

}
