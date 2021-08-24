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
import graphql.annotations.connection.GraphQLConnection;
import graphql.schema.DataFetchingEnvironment;
import org.jahia.api.usermanager.JahiaUserManagerService;
import org.jahia.modules.apitokens.TokenDetails;
import org.jahia.modules.apitokens.TokenService;
import org.jahia.modules.graphql.provider.dxm.DataFetchingException;
import org.jahia.modules.graphql.provider.dxm.osgi.annotations.GraphQLOsgiService;
import org.jahia.modules.graphql.provider.dxm.predicate.FieldEvaluator;
import org.jahia.modules.graphql.provider.dxm.predicate.FieldSorterInput;
import org.jahia.modules.graphql.provider.dxm.predicate.SorterHelper;
import org.jahia.modules.graphql.provider.dxm.relay.DXPaginatedData;
import org.jahia.modules.graphql.provider.dxm.relay.DXPaginatedDataConnectionFetcher;
import org.jahia.modules.graphql.provider.dxm.relay.PaginationHelper;
import org.jahia.modules.graphql.provider.dxm.util.ContextUtil;
import org.jahia.services.securityfilter.PermissionService;
import org.jahia.services.content.JCRTemplate;
import org.jahia.services.content.decorator.JCRUserNode;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import java.util.Collection;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * PersonalApiTokens query type
 */
@GraphQLName("PersonalApiTokensQuery")
@GraphQLDescription("Queries for Personal Api Tokens")
public class GqlPersonalApiTokensQuery {

    @Inject
    @GraphQLOsgiService
    private TokenService tokensService;

    @Inject
    @GraphQLOsgiService
    private JCRTemplate jcrTemplate;

    @Inject
    @GraphQLOsgiService
    private JahiaUserManagerService userManagerService;

    @Inject
    @GraphQLOsgiService
    private PermissionService permissionService;

    /**
     * Check token validity
     *
     * @param token The token
     * @return true if valid
     */
    @GraphQLField
    @GraphQLDescription("Check if the token is valid for authentication")
    public boolean verifyToken(@GraphQLName("token") @GraphQLDescription("The token") @GraphQLNonNull String token) {
        try {
            TokenDetails tokenDetails = tokensService.verifyToken(token, jcrTemplate.getSessionFactory().getCurrentUserSession());
            if (tokenDetails != null) {
                return tokenDetails.isValid();
            }

            return false;
        } catch (Exception e) {
            throw new DataFetchingException(e);
        }
    }

    /**
     * Get token details, based on key
     *
     * @param key The token key
     * @return token details
     */
    @GraphQLField
    @GraphQLDescription("Get token details, based on key")
    public GqlToken getTokenByKey(@GraphQLName("key") @GraphQLDescription("The token key") @GraphQLNonNull String key) {
        try {
            TokenDetails tokenDetails = tokensService.getTokenDetails(key, jcrTemplate.getSessionFactory().getCurrentUserSession());
            if (tokenDetails != null) {
                return new GqlToken(tokenDetails);
            }

            return null;
        } catch (Exception e) {
            throw new DataFetchingException(e);
        }
    }

    /**
     * Get token details, based on user and token name
     *
     * @param userId    The user id
     * @param site      The site the user belongs to, null if global user
     * @param tokenName The token name
     * @return token details
     */
    @GraphQLField
    @GraphQLDescription("Get token details, based on user and token name")
    public GqlToken getTokenByUserAndName(@GraphQLName("userId") @GraphQLDescription("The user id") @GraphQLNonNull String userId,
                                          @GraphQLName("site") @GraphQLDescription("The site the user belongs to, null if global user") String site,
                                          @GraphQLName("tokenName") @GraphQLDescription("The token name") @GraphQLNonNull String tokenName) {
        JCRUserNode userNode = userManagerService.lookupUser(userId, site);
        if (userNode == null) {
            throw new DataFetchingException("Cannot find user");
        }

        try {
            TokenDetails tokenDetails = tokensService.getTokenDetails(userNode.getPath(), tokenName, jcrTemplate.getSessionFactory().getCurrentUserSession());
            if (tokenDetails != null) {
                return new GqlToken(tokenDetails);
            }

            return null;
        } catch (Exception e) {
            throw new DataFetchingException(e);
        }
    }

    /**
     * Find tokens
     *
     * @param userId      If a userId is provided, only returns tokens assigned to that user.
     * @param site        The site the user belongs to, null if global user
     * @param fieldSorter Sort by graphQL fields values
     * @param environment GQL Environment
     * @return token details
     */
    @GraphQLField
    @GraphQLDescription("List tokens attached to the provided user ID and site key")
    @GraphQLConnection(connectionFetcher = DXPaginatedDataConnectionFetcher.class)
    public DXPaginatedData<GqlToken> getTokens(@GraphQLName("userId") @GraphQLDescription("If a userId is provided, only returns tokens assigned to that user.") String userId,
                                               @GraphQLName("site") @GraphQLDescription("The site the user belongs to, null if global user") String site,
                                               @GraphQLName("fieldSorter") @GraphQLDescription("Sort by graphQL fields values") FieldSorterInput fieldSorter,
                                               DataFetchingEnvironment environment) {
        PaginationHelper.Arguments arguments = PaginationHelper.parseArguments(environment);

        try {
            String userPath = null;
            if (userId != null) {
                JCRUserNode userNode = userManagerService.lookupUser(userId, site);
                if (userNode == null) {
                    throw new DataFetchingException("Unknown user");
                }
                userPath = userNode.getPath();
            }

            Stream<GqlToken> tokens = tokensService.getTokensDetails(userPath, jcrTemplate.getSessionFactory().getCurrentUserSession())
                    .map(GqlToken::new);

            if (fieldSorter != null) {
                tokens = tokens.sorted(SorterHelper.getFieldComparator(fieldSorter, FieldEvaluator.forConnection(environment)));
            }

            return PaginationHelper.paginate(tokens, n -> PaginationHelper.encodeCursor(n.getKey()), arguments);
        } catch (Exception e) {
            throw new DataFetchingException(e);
        }
    }

    /**
     * Get available scopes
     *
     * @return token details
     */
    @GraphQLField
    @GraphQLDescription("Get available scopes")
    public Collection<GqlScope> getAvailableScopes(DataFetchingEnvironment environment) {
        HttpServletRequest httpRequest = ContextUtil.getHttpServletRequest(environment.getContext());
        return permissionService.getAvailableScopes().stream()
                .filter(s -> "true".equals(s.getMetadata().get("visible")))
                .filter(s -> s.isValid(httpRequest))
                .map(GqlScope::new).collect(Collectors.toList());
    }

}
