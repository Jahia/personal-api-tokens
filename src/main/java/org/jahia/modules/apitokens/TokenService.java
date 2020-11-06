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
package org.jahia.modules.apitokens;

import org.jahia.services.content.JCRSessionWrapper;

import javax.jcr.RepositoryException;

/**
 * Service to handle Personal API tokens
 */
public interface TokenService {
    /**
     * Create new token based on the specified token details
     *
     * The key, if provided, will be ignored as a new token will be randomly created
     *
     * @param tokenDetails Token details, including userId, name and other options
     * @return The token
     * @throws RepositoryException when repository operation fails
     */
    public String createToken(TokenDetails tokenDetails) throws RepositoryException;

    /**
     * Get the token details for the specified token, or null if token is invalid
     *
     * @param token The token
     * @param session The session to use to retrieve the token
     * @return Token details
     * @throws RepositoryException when repository operation fails
     */
    public TokenDetails getTokenDetails(String token, JCRSessionWrapper session) throws RepositoryException;
}
