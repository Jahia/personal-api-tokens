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
import org.apache.jackrabbit.util.ISO8601;
import org.jahia.modules.apitokens.TokenDetails;
import org.jahia.modules.apitokens.TokenService;
import org.jahia.modules.graphql.provider.dxm.osgi.annotations.GraphQLOsgiService;

import javax.inject.Inject;
import java.util.Calendar;

@GraphQLName("PersonalApiTokensMutation")
public class GqlPersonalApiTokensMutation {

    @Inject
    @GraphQLOsgiService
    private TokenService tokensService;

    @GraphQLName("TokenState")
    public enum TokenState {
        ACTIVE, DISABLED
    }

    @GraphQLField
    @GraphQLName("createToken")
    public String createToken(@GraphQLName("userId") @GraphQLDescription("User ID to attach the token to") @GraphQLNonNull String userId,
                              @GraphQLName("name") @GraphQLDescription("Name to give to the token") @GraphQLNonNull String name,
                              @GraphQLName("expireAt") @GraphQLDescription("Expiration date of the token") String expireAt,
                              @GraphQLName("state") @GraphQLDescription("State to give the newly created token") TokenState state
    ) {
        Calendar expiration = expireAt != null ? ISO8601.parse(expireAt) : null;
        TokenDetails tokenDetails = new TokenDetails(userId, name);
        tokenDetails.setExpirationDate(expiration);
        tokenDetails.setActive(state != TokenState.DISABLED);

        return tokensService.createToken(tokenDetails);
    }



}
