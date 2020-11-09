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
import org.jahia.api.usermanager.JahiaUserManagerService;
import org.jahia.modules.apitokens.TokenDetails;
import org.jahia.modules.graphql.provider.dxm.osgi.annotations.GraphQLOsgiService;
import org.jahia.modules.graphql.provider.dxm.user.GqlUser;
import org.joda.time.DateTime;

import javax.inject.Inject;

/**
 * Graphql representation for TokenDetails
 */
@GraphQLName("PersonalApiToken")
public class GqlToken {

    private TokenDetails tokenDetails;

    @Inject
    @GraphQLOsgiService
    private JahiaUserManagerService userManagerService;

    /**
     * Constructor
     *
     * @param tokenDetails tokenDetails
     */
    public GqlToken(TokenDetails tokenDetails) {
        this.tokenDetails = tokenDetails;
    }

    @GraphQLField
    @GraphQLDescription("The name of the token")
    public String getName() {
        return tokenDetails.getName();
    }

    @GraphQLField
    @GraphQLDescription("The key of the token, used for looking it up")
    public String getKey() {
        return tokenDetails.getKey();
    }

    @GraphQLField
    @GraphQLDescription("The user associated to the token")
    public GqlUser getUser() {
        return new GqlUser(userManagerService.lookupUserByPath(tokenDetails.getUserPath()).getJahiaUser());
    }

    @GraphQLField
    @GraphQLDescription("Creation date and time")
    public String getCreatedAt() {
        return tokenDetails.getCreationDate() != null ? (new DateTime(tokenDetails.getCreationDate().getTime().getTime())).toString() : null;
    }

    @GraphQLField
    @GraphQLDescription("Last modification date and time")
    public String getUpdatedAt() {
        return tokenDetails.getModificationDate() != null ? (new DateTime(tokenDetails.getModificationDate().getTime().getTime())).toString() : null;
    }

    @GraphQLField
    @GraphQLDescription("Time of token last usage")
    public String getLastUsedAt() {
        return tokenDetails.getLastUsageDate() != null ? (new DateTime(tokenDetails.getLastUsageDate().getTime().getTime())).toString() : null;
    }

    @GraphQLField
    @GraphQLDescription("Expiration date")
    public String getExpireAt() {
        return tokenDetails.getExpirationDate() != null ? (new DateTime(tokenDetails.getExpirationDate().getTime().getTime())).toString() : null;
    }

    @GraphQLField
    @GraphQLDescription("Token state")
    public TokenState getState() {
        return tokenDetails.isActive() ? TokenState.ACTIVE : TokenState.DISABLED;
    }
}
