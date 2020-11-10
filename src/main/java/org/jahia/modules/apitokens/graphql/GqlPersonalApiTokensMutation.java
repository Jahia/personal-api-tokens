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
package org.jahia.modules.apitokens.graphql;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;
import graphql.annotations.annotationTypes.GraphQLNonNull;
import org.apache.commons.lang.StringUtils;
import org.jahia.api.usermanager.JahiaUserManagerService;
import org.jahia.modules.apitokens.TokenDetails;
import org.jahia.modules.apitokens.TokenService;
import org.jahia.modules.graphql.provider.dxm.DataFetchingException;
import org.jahia.modules.graphql.provider.dxm.osgi.annotations.GraphQLOsgiService;
import org.jahia.services.content.JCRContentUtils;
import org.jahia.services.content.JCRTemplate;
import org.jahia.services.content.decorator.JCRUserNode;
import org.joda.time.DateTime;

import javax.inject.Inject;
import javax.jcr.RepositoryException;
import java.util.Calendar;
import java.util.Locale;

/**
 * PersonalApiTokens mutation type
 */
@GraphQLName("PersonalApiTokensMutation")
@GraphQLDescription("Mutations for Personal Api Tokens")
public class GqlPersonalApiTokensMutation {

    @Inject
    @GraphQLOsgiService
    private TokenService tokensService;

    @Inject
    @GraphQLOsgiService
    private JCRTemplate jcrTemplate;

    @Inject
    @GraphQLOsgiService
    private JahiaUserManagerService userManagerService;

    /**
     * Create a new token
     *
     * @param userId   User ID to attach the token to
     * @param name     Name to give to the token
     * @param site     The site the user belongs to, null if global user
     * @param expireAt Expiration date of the token
     * @param state    State to give the newly created token
     * @return new token
     */
    @GraphQLField
    @GraphQLDescription("Create a new token")
    public String createToken(@GraphQLName("userId") @GraphQLDescription("User ID to attach the token to") @GraphQLNonNull String userId,
                              @GraphQLName("name") @GraphQLDescription("Name to give to the token") @GraphQLNonNull String name,
                              @GraphQLName("site") @GraphQLDescription("The site the user belongs to, null if global user") String site,
                              @GraphQLName("expireAt") @GraphQLDescription("Expiration date of the token") String expireAt,
                              @GraphQLName("state") @GraphQLDescription("State to give the newly created token") TokenState state) {
        JCRUserNode userNode = userManagerService.lookupUser(userId, site);
        if (userNode == null) {
            throw new DataFetchingException("Cannot find user");
        }

        try {
            return jcrTemplate.doExecute(jcrTemplate.getSessionFactory().getCurrentUser(), null, null, session -> {
                Calendar expiration = expireAt != null ? new DateTime(expireAt).toCalendar(Locale.getDefault()) : null;
                String token = tokensService.tokenBuilder(userNode.getPath(), JCRContentUtils.escapeLocalNodeName(name), session)
                        .setExpirationDate(expiration)
                        .setActive(state != TokenState.DISABLED)
                        .create();
                session.save();
                return token;
            });
        } catch (Exception e) {
            throw new DataFetchingException(e);
        }
    }

    /**
     * Update an existing token
     *
     * @param key      The token key
     * @param name     Name to give to the token
     * @param expireAt Expiration date of the token
     * @param state    State to give the token
     * @return true if operation succeeds, false if token does not exist
     */
    @GraphQLField
    @GraphQLDescription("Update an existing token")
    public boolean updateToken(@GraphQLName("key") @GraphQLDescription("The token key")  @GraphQLNonNull String key,
                               @GraphQLName("name") @GraphQLDescription("Name to give to the token") String name,
                               @GraphQLName("expireAt") @GraphQLDescription("Expiration date of the token, use empty string to unset expiration date") String expireAt,
                               @GraphQLName("state") @GraphQLDescription("State to give the token") TokenState state) {
        try {
            return jcrTemplate.doExecute(jcrTemplate.getSessionFactory().getCurrentUser(), null, null, session -> {
                TokenDetails details = tokensService.getTokenDetails(key, session);
                if (name != null) {
                    details.setName(name);
                }
                if (expireAt != null) {
                    if (StringUtils.isEmpty(expireAt)) {
                        details.setExpirationDate(null);
                    } else {
                        details.setExpirationDate(new DateTime(expireAt).toCalendar(Locale.getDefault()));
                    }
                }
                if (state != null) {
                    details.setActive(state != TokenState.DISABLED);
                }
                boolean updateToken = tokensService.updateToken(details, session);
                session.save();
                return updateToken;
            });
        } catch (RepositoryException e) {
            throw new DataFetchingException(e);
        }
    }

    /**
     * Delete an existing token
     *
     * @param key The token key
     * @return true if operation succeeds, false if token does not exist
     */
    @GraphQLField
    @GraphQLDescription("Delete an existing token")
    public boolean deleteToken(@GraphQLName("key") @GraphQLDescription("The token key")  @GraphQLNonNull String key) {
        try {
            return jcrTemplate.doExecute(jcrTemplate.getSessionFactory().getCurrentUser(), null, null, session -> {
                boolean deleteToken = tokensService.deleteToken(key, session);
                session.save();
                return deleteToken;
            });
        } catch (RepositoryException e) {
            throw new DataFetchingException(e);
        }
    }

}
