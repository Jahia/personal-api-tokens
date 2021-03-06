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
     * Gets a new token builder for the specified user and token name.
     * You'll have to call create() on builder and save the session afterwards.
     *
     * @param userPath The user path
     * @param name     The name of the token
     * @param session  The session
     * @return The token builder
     * @throws RepositoryException when repository operation fails
     */
    public TokenBuilder tokenBuilder(String userPath, String name, JCRSessionWrapper session) throws RepositoryException;

    /**
     * Verify the specifid and token and return the details if valid, or null if token is invalid
     *
     * @param token   The token
     * @param session The session to use to retrieve the token
     * @return Token details
     * @throws RepositoryException when repository operation fails
     */
    public TokenDetails verifyToken(String token, JCRSessionWrapper session) throws RepositoryException;

    /**
     * Get the token details for the specified key, or null if it does not exist
     *
     * @param key     The token
     * @param session The session to use to retrieve the token
     * @return Token details
     * @throws RepositoryException when repository operation fails
     */
    public TokenDetails getTokenDetails(String key, JCRSessionWrapper session) throws RepositoryException;

    /**
     * Get the token details for the specified key, or null if it does not exist
     *
     * @param userPath  The user path
     * @param tokenName The token name
     * @param session   The session to use to retrieve the token
     * @return Token details
     * @throws RepositoryException when repository operation fails
     */
    public TokenDetails getTokenDetails(String userPath, String tokenName, JCRSessionWrapper session) throws RepositoryException;

    /**
     * Get a list of tokens for the specified user, or for all users if userId is null
     *
     * @param userPath The user path on which you want to filter the tokens
     * @param session  The session to use to retrieve the tokens
     * @return The tokens details
     * @throws RepositoryException when repository operation fails
     */
    public Stream<TokenDetails> getTokensDetails(String userPath, JCRSessionWrapper session) throws RepositoryException;

    /**
     * Update token. You can change name, expiration date and state
     *
     * @param details The updated token details
     * @param session The session
     * @return true if operation succeeds, false if token does not exist
     * @throws RepositoryException when repository operation fails
     */
    public boolean updateToken(TokenDetails details, JCRSessionWrapper session) throws RepositoryException;

    /**
     * Delete an existing token
     *
     * @param key     The token key
     * @param session The session
     * @return true if operation succeeds, false if token does not exist
     * @throws RepositoryException when repository operation fails
     */
    public boolean deleteToken(String key, JCRSessionWrapper session) throws RepositoryException;


}
