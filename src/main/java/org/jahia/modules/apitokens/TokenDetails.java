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

/**
 * Token details bean
 */
public class TokenDetails {
    private String key;

    private String userPath;

    private String name;

    private Calendar expirationDate;
    private Calendar creationDate;
    private Calendar modificationDate;
    private Calendar lastUsageDate;

    private boolean isActive = true;

    /**
     * New token details from userId and token name
     * @param userId userId
     * @param name name
     */
    public TokenDetails(String userId, String name) {
        this.userPath = userId;
        this.name = name;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getUserPath() {
        return userPath;
    }

    public void setUserPath(String userPath) {
        this.userPath = userPath;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Calendar getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(Calendar expirationDate) {
        this.expirationDate = expirationDate;
    }

    public Calendar getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Calendar creationDate) {
        this.creationDate = creationDate;
    }

    public Calendar getModificationDate() {
        return modificationDate;
    }

    public void setModificationDate(Calendar modificationDate) {
        this.modificationDate = modificationDate;
    }

    public Calendar getLastUsageDate() {
        return lastUsageDate;
    }

    public void setLastUsageDate(Calendar lastUsageDate) {
        this.lastUsageDate = lastUsageDate;
    }

    public boolean isActive() {
        return isActive;
    }

    public boolean isValid() {
        return isActive && (expirationDate == null || Calendar.getInstance().before(expirationDate));
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    @Override
    public String toString() {
        return "TokenDetails{" + "key='" + key + '\'' +
                ", userId='" + userPath + '\'' +
                ", name='" + name + '\'' +
                ", expirationDate=" + expirationDate +
                ", isActive=" + isActive + '}';
    }
}
