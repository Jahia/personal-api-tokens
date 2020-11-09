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

import graphql.ErrorType;
import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;
import graphql.annotations.annotationTypes.GraphQLNonNull;
import graphql.annotations.connection.GraphQLConnection;
import graphql.schema.DataFetchingEnvironment;
import org.jahia.api.usermanager.JahiaUserManagerService;
import org.jahia.modules.apitokens.TokenDetails;
import org.jahia.modules.apitokens.TokenService;
import org.jahia.modules.graphql.provider.dxm.BaseGqlClientException;
import org.jahia.modules.graphql.provider.dxm.DataFetchingException;
import org.jahia.modules.graphql.provider.dxm.osgi.annotations.GraphQLOsgiService;
import org.jahia.modules.graphql.provider.dxm.relay.DXPaginatedData;
import org.jahia.modules.graphql.provider.dxm.relay.DXPaginatedDataConnectionFetcher;
import org.jahia.modules.graphql.provider.dxm.relay.PaginationHelper;
import org.jahia.services.content.JCRTemplate;
import org.jahia.services.content.decorator.JCRUserNode;
import org.jahia.services.usermanager.JahiaUser;

import javax.inject.Inject;
import java.util.stream.Stream;

import static graphql.validation.ValidationErrorType.MissingFieldArgument;

/**
 * PersonalApiTokens query type
 */
@GraphQLName("PersonalApiTokensQuery")
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

    /**
     * Get token details
     * @param key The token key
     * @return token details
     */
    @GraphQLField
    @GraphQLDescription("Get token details")
    public GqlToken getToken(@GraphQLName("key") @GraphQLDescription("The token key") @GraphQLNonNull String key) {
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
     * Find tokens
     * @param userId If a userId is provided, only returns tokens assigned to that user.
     * @param site The site the user belongs to, null if global user
     * @param environment GQL Environment
     * @return token details
     */
    @GraphQLField
    @GraphQLDescription("Find tokens")
    @GraphQLConnection(connectionFetcher = DXPaginatedDataConnectionFetcher.class)
    public DXPaginatedData<GqlToken> getTokens(@GraphQLName("userId") @GraphQLDescription("If a userId is provided, only returns tokens assigned to that user.") String userId,
                                               @GraphQLName("site") @GraphQLDescription("The site the user belongs to, null if global user") String site,
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

            return PaginationHelper.paginate(tokens, n -> PaginationHelper.encodeCursor(n.getKey()), arguments);
        } catch (Exception e) {
            throw new DataFetchingException(e);
        }
    }

    /**
     * Find tokens for current user
     * @param environment GQL Environment
     * @return token details
     */
    @GraphQLField
    @GraphQLDescription("Find tokens for current user")
    @GraphQLConnection(connectionFetcher = DXPaginatedDataConnectionFetcher.class)
    public DXPaginatedData<GqlToken> getCurrentUserTokens(DataFetchingEnvironment environment) {
        JahiaUser currentUser = jcrTemplate.getSessionFactory().getCurrentUser();
        return getTokens(currentUser.getUsername(), currentUser.getRealm(), environment);
    }

}
