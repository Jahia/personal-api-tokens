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

import java.util.Calendar;
import java.util.List;

/**
 * Token details bean
 */
public interface TokenDetails {
    /**
     * Get the token key, used for managing the token
     * @return the key
     */
    String getKey();

    /**
     * Get the path of the user node associated to this token
     * @return user path
     */
    String getUserPath();

    /**
     * Get the digested secret, used for comparison only
     * @return digested secret
     */
    String getDigest();

    /**
     * Get the name of the token
     * @return name
     */
    String getName();

    void setName(String name);

    /**
     * Get the expiration date
     * @return expiration date
     */
    Calendar getExpirationDate();

    void setExpirationDate(Calendar expirationDate);

    /**
     * Get the creation date
     * @return creation date
     */
    Calendar getCreationDate();

    void setCreationDate(Calendar creationDate);

    /**
     * Get the modification date
     * @return modification date
     */
    Calendar getModificationDate();

    void setModificationDate(Calendar modificationDate);

    /**
     * Get the active flag
     * @return active flag
     */
    boolean isActive();

    void setActive(boolean active);

    /**
     * Get the associated scopes
     * @return scopes
     */
    List<String> getScopes();

    void setScopes(List<String> scopes);

    /**
     * Check current validity of the token - it will check the active flag and the expiration date
     * @return true if valid
     */
    boolean isValid();

    /**
     * Does this token allow auto applied scopes.
     * If true then the token may not be limited by defined scopes.
     * @return boolean
     */
    boolean autoApplyScopes();

    void setAutoApplyScopes(boolean autoApplyScopes);

}
