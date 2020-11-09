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
import org.jahia.api.usermanager.JahiaUserManagerService;
import org.jahia.modules.apitokens.TokenDetails;
import org.jahia.modules.apitokens.TokenService;
import org.jahia.services.content.JCRContentUtils;
import org.jahia.services.content.JCRNodeIteratorWrapper;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRSessionWrapper;
import org.jahia.services.content.decorator.JCRUserNode;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.touk.throwing.ThrowingFunction;
import pl.touk.throwing.exception.WrappedException;

import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.query.Query;
import java.util.Collections;
import java.util.Iterator;
import java.util.Spliterator;
import java.util.Spliterators;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

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

    private JahiaUserManagerService userManagerService;

    @Reference
    public void setUserManagerService(JahiaUserManagerService userManagerService) {
        this.userManagerService = userManagerService;
    }

    public String createToken(TokenDetails tokenDetails, JCRSessionWrapper currentUserSession) throws RepositoryException {
        String token = TokenUtils.getInstance().generateToken();

        String key = TokenUtils.getInstance().getKey(token);
        String digestedSecret = TokenUtils.getInstance().getDigestedSecret(token);

        JCRUserNode userNode = userManagerService.lookupUserByPath(tokenDetails.getUserPath(), currentUserSession);
        if (userNode == null) {
            throw new IllegalArgumentException("invalid user");
        }

        JCRNodeWrapper tokens = getTokensNode(userNode);
        JCRNodeWrapper tokenNode = tokens.addNode(tokenDetails.getName(), PATNT_TOKEN);
        tokenNode.setProperty(KEY, key);
        tokenNode.setProperty(DIGEST, digestedSecret);
        tokenNode.setProperty(ACTIVE, tokenDetails.isActive());
        tokenNode.setProperty(EXPIRATION_DATE, tokenDetails.getExpirationDate());

        logger.info("New token generated {}", getTokenDetails(token, currentUserSession));

        return token;
    }

    public TokenDetails verifyToken(String token, JCRSessionWrapper session) throws RepositoryException {
        TokenDetails tokenDetails = getTokenDetails(TokenUtils.getInstance().getKey(token), session);
        if (tokenDetails != null) {
            String digestedSecret = TokenUtils.getInstance().getDigestedSecret(token);
            if (digestedSecret.equals(tokenDetails.getDigest())) {
                return tokenDetails;
            }
        }

        return null;
    }

    public TokenDetails getTokenDetails(String key, JCRSessionWrapper session) throws RepositoryException {
        Query q = session.getWorkspace().getQueryManager()
                .createQuery("select * from [patnt:token] where key=\"" + JCRContentUtils.sqlEncode(key) + "\"", Query.JCR_SQL2);
        NodeIterator ni = q.execute().getNodes();
        if (ni.hasNext()) {
            return getTokenDetails((JCRNodeWrapper) ni.nextNode());
        }

        return null;
    }

    public Stream<TokenDetails> getTokensDetails(String userId, JCRSessionWrapper session) throws RepositoryException {
        String path = null;
        if (userId != null) {
            JCRUserNode userNode = userManagerService.lookupUser(userId);
            if (userNode == null) {
                throw new IllegalArgumentException("Unknown user");
            }
            path = userNode.getPath();
        }

        String query = path == null ? "select * from [patnt:token]" :
                "select * from [patnt:token] where isdescendantnode('" + JCRContentUtils.sqlEncode(path) + "')";

        Query q = session.getWorkspace().getQueryManager().createQuery(query, Query.JCR_SQL2);

        Iterator<JCRNodeWrapper> nodes = ((JCRNodeIteratorWrapper) q.execute().getNodes()).iterator();

        try {
            return StreamSupport.stream(Spliterators.spliteratorUnknownSize(nodes, Spliterator.ORDERED), false)
                    .map(ThrowingFunction.unchecked(this::getTokenDetails));
        } catch (WrappedException e) {
            if (e.getCause() instanceof RepositoryException) {
                throw (RepositoryException) e.getCause();
            }

            throw e;
        }
    }

    private TokenDetails getTokenDetails(JCRNodeWrapper node) throws RepositoryException {
        JCRNodeWrapper parent = node.getParent().getParent();
        if (!parent.isNodeType("jnt:user")) {
            return null;
        }

        TokenDetails tokenDetails = new TokenDetails(parent.getPath(), node.getName());
        tokenDetails.setKey(node.getProperty(KEY).getString());
        tokenDetails.setActive(node.getProperty(ACTIVE).getBoolean());
        tokenDetails.setDigest(node.getProperty(DIGEST).getString());
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

    private JCRNodeWrapper getTokensNode(JCRUserNode userNode) throws RepositoryException {
        if (userNode.hasNode(TOKENS)) {
            return userNode.getNode(TOKENS);
        }

        JCRNodeWrapper tokens = userNode.addNode(TOKENS, PATNT_TOKENS);
        tokens.setAclInheritanceBreak(true);
        tokens.grantRoles("u:" + userNode.getName(), Collections.singleton("owner"));
        return tokens;
    }

}
