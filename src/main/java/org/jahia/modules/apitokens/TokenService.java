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
import java.util.stream.Stream;

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
     * @param session The session
     * @return The token
     * @throws RepositoryException when repository operation fails
     */
    public String createToken(TokenDetails tokenDetails, JCRSessionWrapper session) throws RepositoryException;

    /**
     * Verify the specifid and token and return the details if valid, or null if token is invalid
     *
     * @param token The token
     * @param session The session to use to retrieve the token
     * @return Token details
     * @throws RepositoryException when repository operation fails
     */
    public TokenDetails verifyToken(String token, JCRSessionWrapper session) throws RepositoryException;

    /**
     * Get the token details for the specified key, or null if it does not exist
     *
     * @param key The token
     * @param session The session to use to retrieve the token
     * @return Token details
     * @throws RepositoryException when repository operation fails
     */
    public TokenDetails getTokenDetails(String key, JCRSessionWrapper session) throws RepositoryException;

    /**
     * Get a list of tokens for the specified user, or for all users if userId is null
     * @param userId The userId on which you want to filter the tokens
     * @param session The session to use to retrieve the tokens
     * @return The tokens details
     * @throws RepositoryException when repository operation fails
     */
    public Stream<TokenDetails> getTokensDetails(String userId, JCRSessionWrapper session) throws RepositoryException;

}
