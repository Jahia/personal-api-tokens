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

import javax.jcr.RepositoryException;
import java.util.Calendar;

/**
 * Token builder
 */
public interface TokenBuilder {
    /**
     * Set token if you want ot use a predefined value. Leave it null to get an auto-generated token
     * @param token token value
     * @return builder
     */
    public TokenBuilder setToken(String token);

    /**
     * Set the expiration date
     * @param expirationDate expiration date
     * @return builder
     */
    public TokenBuilder setExpirationDate(Calendar expirationDate);

    /**
     * Set active flag
     * @param active active flag
     * @return builder
     */
    public TokenBuilder setActive(boolean active);

    /**
     * Create the token in the JCR. Session has to be saved to persist the token.
     * @return the token value
     * @throws RepositoryException if repository operation fails
     */
    public String create() throws RepositoryException;
}
