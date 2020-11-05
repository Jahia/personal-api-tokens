/*
 * Copyright (C) 2002-2020 Jahia Solutions Group SA. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.jahia.modules.apitokens.core;

import org.jahia.api.Constants;
import org.jahia.api.content.JCRTemplate;
import org.jahia.api.usermanager.JahiaUserManagerService;
import org.jahia.modules.apitokens.TokenDetails;
import org.jahia.modules.apitokens.TokenService;
import org.jahia.services.content.JCRContentUtils;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRSessionWrapper;
import org.jahia.services.content.decorator.JCRUserNode;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.query.Query;

/**
 * Service to handle Personal API tokens
 */
@Component(immediate = true, service = TokenService.class)
public class TokensServiceImpl implements TokenService {
    private static final Logger logger = LoggerFactory.getLogger(TokensServiceImpl.class);

    public static final String PATNT_TOKENS = "patnt:tokens";
    public static final String PATNT_TOKEN = "patnt:token";
    public static final String TOKENS = "tokens";
    public static final String KEY = "key";
    public static final String DIGEST = "digest";
    public static final String ACTIVE = "active";
    public static final String EXPIRATION_DATE = "expirationDate";
    public static final String LAST_USAGE_DATE = "lastUsageDate";

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

    public String createToken(TokenDetails tokenDetails) throws RepositoryException {
        String token = TokenUtils.getInstance().generateToken();

        String key = TokenUtils.getInstance().getKey(token);
        String digestedSecret = TokenUtils.getInstance().getDigestedSecret(token);

        JCRSessionWrapper currentUserSession = jcrTemplate.getSessionFactory().getCurrentUserSession();
        JCRUserNode userNode = userManagerService.lookupUser(tokenDetails.getUserId(), currentUserSession);
        if (userNode == null) {
            throw new IllegalArgumentException("invalid user");
        }

        JCRNodeWrapper tokens = userNode.hasNode(TOKENS) ? userNode.getNode(TOKENS) : userNode.addNode(TOKENS, PATNT_TOKENS);
        JCRNodeWrapper tokenNode = tokens.addNode(tokenDetails.getName(), PATNT_TOKEN);
        tokenNode.setProperty(KEY, key);
        tokenNode.setProperty(DIGEST, digestedSecret);
        tokenNode.setProperty(ACTIVE, tokenDetails.isActive());
        tokenNode.setProperty(EXPIRATION_DATE, tokenDetails.getExpirationDate());

        currentUserSession.save();

        logger.info("New token generated {}", getTokenDetails(token));

        return token;
    }

    public TokenDetails getTokenDetails(String token) throws RepositoryException {
        String key = TokenUtils.getInstance().getKey(token);

        JCRSessionWrapper currentUserSession = jcrTemplate.getSessionFactory().getCurrentUserSession();
        Query q = currentUserSession.getWorkspace().getQueryManager().createQuery("select * from [patnt:token] where key=\"" + JCRContentUtils.sqlEncode(key) + "\"", Query.JCR_SQL2);
        NodeIterator ni = q.execute().getNodes();
        if (ni.hasNext()) {
            JCRNodeWrapper node = (JCRNodeWrapper) ni.nextNode();

            String digestedSecret = TokenUtils.getInstance().getDigestedSecret(token);
            if (digestedSecret.equals(node.getProperty(DIGEST).getString())) {
                return getTokenDetails(node);
            }
        }

        return null;
    }

    private TokenDetails getTokenDetails(JCRNodeWrapper node) throws RepositoryException {
        JCRNodeWrapper parent = node.getParent().getParent();
        if (!parent.isNodeType("jnt:user")) {
            return null;
        }

        TokenDetails tokenDetails = new TokenDetails(parent.getName(), node.getName());
        tokenDetails.setKey(node.getProperty(KEY).getString());
        tokenDetails.setActive(node.getProperty(ACTIVE).getBoolean());
        if (node.hasProperty(EXPIRATION_DATE)) {
            tokenDetails.setExpirationDate(node.getProperty(EXPIRATION_DATE).getDate());
        }

        tokenDetails.setCreationDate(node.getProperty(Constants.JCR_CREATED).getDate());
        tokenDetails.setModificationDate(node.getProperty(Constants.JCR_LASTMODIFIED).getDate());
        if (node.hasProperty(LAST_USAGE_DATE)) {
            tokenDetails.setExpirationDate(node.getProperty(LAST_USAGE_DATE).getDate());
        }

        return tokenDetails;
    }

}
