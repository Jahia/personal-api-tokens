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
import org.jahia.modules.apitokens.TokenBuilder;
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
import java.util.*;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

/**
 * Service to handle Personal API tokens
 */
@Component(immediate = true, service = TokenService.class)
public class TokensServiceImpl implements TokenService {
    public static final String PATNT_TOKENS = "patnt:tokens";
    public static final String PATNT_TOKEN = "patnt:token";
    public static final String TOKENS = "tokens";
    public static final String KEY = "key";
    public static final String DIGEST = "digest";
    public static final String ACTIVE = "active";
    public static final String EXPIRATION_DATE = "expirationDate";
    public static final String LAST_USAGE_DATE = "lastUsageDate";
    private static final Logger logger = LoggerFactory.getLogger(TokensServiceImpl.class);
    private JahiaUserManagerService userManagerService;

    @Reference
    public void setUserManagerService(JahiaUserManagerService userManagerService) {
        this.userManagerService = userManagerService;
    }

    public TokenBuilder tokenBuilder(String userPath, String name, JCRSessionWrapper currentUserSession) {
        TokenDetailsImpl details = new TokenDetailsImpl(userPath, name);
        return new TokenBuilderImpl(details, token -> createToken(token, details, currentUserSession));
    }

    private String createToken(String token, TokenDetailsImpl tokenDetails, JCRSessionWrapper session) throws RepositoryException {
        if (token == null) {
            token = TokenUtils.getInstance().generateToken();
        }

        String key = TokenUtils.getInstance().getKey(token);

        if (getTokenDetails(key, session) != null) {
            throw new IllegalArgumentException("token already exists");
        }

        String digestedSecret = TokenUtils.getInstance().getDigestedSecret(token);

        JCRUserNode userNode = userManagerService.lookupUserByPath(tokenDetails.getUserPath(), session);
        if (userNode == null) {
            throw new IllegalArgumentException("invalid user");
        }

        JCRNodeWrapper tokens = getTokensNode(userNode);
        JCRNodeWrapper tokenNode = tokens.addNode(tokenDetails.getName(), PATNT_TOKEN);
        tokenNode.setProperty(KEY, key);
        tokenNode.setProperty(DIGEST, digestedSecret);
        tokenNode.setProperty(ACTIVE, tokenDetails.isActive());
        tokenNode.setProperty(EXPIRATION_DATE, tokenDetails.getExpirationDate());

        logger.info("New token generated {}", getTokenDetails(tokenNode));

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

    public String getTokenKey(String token) throws RepositoryException {
        return TokenUtils.getInstance().getKey(token);
    }

    public TokenDetails getTokenDetails(String key, JCRSessionWrapper session) throws RepositoryException {
        return getTokenDetails(getTokenNode(key, session));
    }

    public TokenDetails getTokenDetails(String userPath, String tokenName, JCRSessionWrapper session) throws RepositoryException {
        Query q = session.getWorkspace().getQueryManager()
                .createQuery("select * from [patnt:token] where isdescendantnode('" + JCRContentUtils.sqlEncode(userPath) + "') " +
                        "and localname()='" + JCRContentUtils.sqlEncode(tokenName) + "'", Query.JCR_SQL2);
        NodeIterator ni = q.execute().getNodes();
        if (ni.hasNext()) {
            return getTokenDetails((JCRNodeWrapper) ni.nextNode());
        }

        return null;
    }

    public Stream<TokenDetails> getTokensDetails(String userPath, JCRSessionWrapper session) throws RepositoryException {
        String query = userPath == null ? "select * from [patnt:token]" :
                "select * from [patnt:token] where isdescendantnode('" + JCRContentUtils.sqlEncode(userPath) + "')";

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

    @Override
    public boolean updateToken(TokenDetails tokenDetails, JCRSessionWrapper session) throws RepositoryException {
        JCRNodeWrapper tokenNode = getTokenNode(tokenDetails.getKey(), session);
        TokenDetails previousDetails = getTokenDetails(tokenNode);
        if (previousDetails != null) {
            if (!previousDetails.getName().equals(tokenDetails.getName())) {
                tokenNode.rename(tokenDetails.getName());
            }
            if (previousDetails.isActive() != tokenDetails.isActive()) {
                tokenNode.setProperty(ACTIVE, tokenDetails.isActive());
            }
            if (getTimeValue(previousDetails.getExpirationDate()) != getTimeValue(tokenDetails.getExpirationDate())) {
                tokenNode.setProperty(EXPIRATION_DATE, tokenDetails.getExpirationDate());
            }
            return true;
        }
        return false;
    }

    private long getTimeValue(Calendar d) {
        return d != null ? d.getTimeInMillis() : -1;
    }

    @Override
    public boolean deleteToken(String key, JCRSessionWrapper session) throws RepositoryException {
        JCRNodeWrapper tokenNode = getTokenNode(key, session);
        if (tokenNode != null) {
            tokenNode.remove();
            return true;
        }
        return false;
    }

    private JCRNodeWrapper getTokenNode(String key, JCRSessionWrapper session) throws RepositoryException {
        Query q = session.getWorkspace().getQueryManager()
                .createQuery("select * from [patnt:token] where key=\"" + JCRContentUtils.sqlEncode(key) + "\"", Query.JCR_SQL2);
        NodeIterator ni = q.execute().getNodes();
        if (ni.hasNext()) {
            return (JCRNodeWrapper) ni.nextNode();
        }
        return null;
    }

    private TokenDetails getTokenDetails(JCRNodeWrapper node) throws RepositoryException {
        if (node == null) {
            return null;
        }
        JCRNodeWrapper parent = node.getParent().getParent();
        if (!parent.isNodeType("jnt:user")) {
            return null;
        }

        TokenDetailsImpl tokenDetails = new TokenDetailsImpl(parent.getPath(), node.getName());
        tokenDetails.setKey(node.getProperty(KEY).getString());
        tokenDetails.setDigest(node.getProperty(DIGEST).getString());
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
