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
package org.jahia.modules.apitokens.core;

import org.jahia.modules.apitokens.TokenBuilder;
import org.jahia.modules.apitokens.TokenDetails;
import org.jahia.services.content.JCRSessionWrapper;
import pl.touk.throwing.ThrowingFunction;

import javax.jcr.RepositoryException;
import java.util.Calendar;

/**
 * Implementation for Token builder
 */
public class TokenBuilderImpl implements TokenBuilder {
    private JCRSessionWrapper session;
    private String token;
    private ThrowingFunction<String, String, RepositoryException> create;
    private TokenDetails details;

    TokenBuilderImpl(TokenDetailsImpl details, JCRSessionWrapper session, ThrowingFunction<String, String, RepositoryException> create) {
        this.session = session;
        this.details = details;
        this.create = create;
    }

    public TokenBuilder setToken(String token) {
        this.token = token;
        return this;
    }

    public TokenBuilder setExpirationDate(Calendar expirationDate) {
        details.setExpirationDate(expirationDate);
        return this;
    }

    public TokenBuilder setActive(boolean active) {
        details.setActive(active);
        return this;
    }

    public String create() throws RepositoryException {
        return create.apply(token);
    }

}
