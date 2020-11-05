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
import org.jahia.modules.apitokens.TokenDetails;
import org.jahia.modules.apitokens.TokenService;
import org.jahia.modules.graphql.provider.dxm.DataFetchingException;
import org.jahia.modules.graphql.provider.dxm.osgi.annotations.GraphQLOsgiService;

import javax.inject.Inject;

/**
 * PersonalApiTokens query type
 */
@GraphQLName("PersonalApiTokensQuery")
public class GqlPersonalApiTokensQuery {

    @Inject
    @GraphQLOsgiService
    private TokenService tokensService;

    /**
     * Get token details
     * @param token The token
     * @return token details
     */
    @GraphQLField
    @GraphQLDescription("Get token details")
    public GqlToken getToken(@GraphQLName("token") @GraphQLDescription("The token") @GraphQLNonNull String token) {
        try {
            TokenDetails tokenDetails = tokensService.getTokenDetails(token);
            if (tokenDetails != null) {
                return new GqlToken(tokenDetails);
            }

            return null;
        } catch (Exception e) {
            throw new DataFetchingException(e);
        }
    }

}
