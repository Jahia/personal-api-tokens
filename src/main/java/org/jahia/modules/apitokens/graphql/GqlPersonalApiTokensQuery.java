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
import org.jahia.modules.apitokens.TokenDetails;
import org.jahia.modules.apitokens.TokenService;
import org.jahia.modules.graphql.provider.dxm.DataFetchingException;
import org.jahia.modules.graphql.provider.dxm.osgi.annotations.GraphQLOsgiService;
import org.jahia.modules.graphql.provider.dxm.relay.DXPaginatedData;
import org.jahia.modules.graphql.provider.dxm.relay.DXPaginatedDataConnectionFetcher;
import org.jahia.modules.graphql.provider.dxm.relay.PaginationHelper;
import org.jahia.services.content.JCRTemplate;

import javax.inject.Inject;
import java.util.stream.Stream;

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

    /**
     * Get token details
     * @param key The token key
     * @return token details
     */
    @GraphQLField
    @GraphQLDescription("Get token details")
    public GqlToken getToken(@GraphQLName("key") @GraphQLDescription("The token") @GraphQLNonNull String key) {
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
     * @param environment GQL Environment
     * @return token details
     */
    @GraphQLField
    @GraphQLDescription("Find tokens")
    @GraphQLConnection(connectionFetcher = DXPaginatedDataConnectionFetcher.class)
    public DXPaginatedData<GqlToken> getTokens(@GraphQLName("userId") @GraphQLDescription("If a userId is provided, only returns tokens assigned to that user.") String userId,
                                               DataFetchingEnvironment environment) {
        PaginationHelper.Arguments arguments = PaginationHelper.parseArguments(environment);

        try {
            Stream<GqlToken> tokens = tokensService.getTokensDetails(userId, jcrTemplate.getSessionFactory().getCurrentUserSession())
                    .map(GqlToken::new);

            return PaginationHelper.paginate(tokens, n -> PaginationHelper.encodeCursor(n.getKey()), arguments);
        } catch (Exception e) {
            throw new DataFetchingException(e);
        }
    }

}
