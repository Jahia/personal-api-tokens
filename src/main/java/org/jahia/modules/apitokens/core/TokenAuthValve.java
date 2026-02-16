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

import org.apache.commons.lang.StringUtils;
import org.jahia.api.usermanager.JahiaUserManagerService;
import org.jahia.bin.filters.CompositeFilter;
import org.jahia.modules.apitokens.TokenConfigService;
import org.jahia.modules.apitokens.TokenDetails;
import org.jahia.modules.apitokens.TokenService;
import org.jahia.services.securityfilter.PermissionService;
import org.jahia.params.valves.AuthValveContext;
import org.jahia.params.valves.BaseAuthValve;
import org.jahia.pipelines.Pipeline;
import org.jahia.pipelines.PipelineException;
import org.jahia.pipelines.valves.Valve;
import org.jahia.pipelines.valves.ValveContext;
import org.jahia.services.content.JCRTemplate;
import org.jahia.services.content.decorator.JCRUserNode;
import org.osgi.service.component.annotations.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.servlet.http.HttpServletRequest;

/**
 * Authentication valve for APIToken Authorization header
 */
@Component(service = Valve.class, immediate = true, scope = ServiceScope.SINGLETON)
public class TokenAuthValve extends BaseAuthValve {
    public static final String API_TOKEN = "APIToken";
    private static final Logger LOGGER = LoggerFactory.getLogger(TokenAuthValve.class);
    private Pipeline authPipeline;
    private TokenService tokenService;
    private JahiaUserManagerService userManagerService;

    private PermissionService permissionService;

    private TokenConfigService tokenConfigService;

    @Reference(service = Pipeline.class, target = "(type=authentication)")
    public void setAuthPipeline(Pipeline authPipeline) {
        this.authPipeline = authPipeline;
    }

    @Reference
    public void setTokenService(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Reference
    public void setUserManagerService(JahiaUserManagerService userManagerService) {
        this.userManagerService = userManagerService;
    }

    @Reference(cardinality = ReferenceCardinality.OPTIONAL)
    public void setPermissionService(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @Reference
    public void setTokenConfigService(TokenConfigService tokenConfigService) {
        this.tokenConfigService = tokenConfigService;
    }

    @Activate
    public void activate() {
        LOGGER.info("Token authentication activated for patterns: {}", tokenConfigService.getUrlPatterns());
        removeValve(authPipeline);
        addValve(authPipeline, 0, null, null);
    }

    /**
     * Deactivate
     */
    @Deactivate
    public void deactivate() {
        removeValve(authPipeline);
        LOGGER.info("Token authentication valve deactivated");
    }

    @Override
    public void invoke(Object o, ValveContext valveContext) throws PipelineException {
        AuthValveContext authValveContext = (AuthValveContext) o;
        HttpServletRequest request = authValveContext.getRequest();

        String uri = request.getRequestURI().substring(request.getContextPath().length());
        if (shouldApplyTokenAuth(uri)) {
            try {
                applyTokenAuth(authValveContext, request);
            } catch (RepositoryException e) {
                throw new PipelineException(e);
            }
        }

        valveContext.invokeNext(o);
    }

    /**
     * Apply token authentication if the request contains a valid token in the Authorization header
     *
     * @param authValveContext the authentication valve context to update with the authenticated user if token is valid
     * @param request the request to check for token authentication
     * @throws RepositoryException if an error occurs while accessing the repository to verify the token or retrieve the user
     */
    private void applyTokenAuth(AuthValveContext authValveContext, HttpServletRequest request) throws RepositoryException {
        String authorization = request.getHeader("Authorization");
        if (authorization != null && authorization.contains(API_TOKEN)) {
            String token = StringUtils.substringAfter(authorization, API_TOKEN).trim();

            JCRTemplate.getInstance().doExecuteWithSystemSession(session -> {
                TokenDetails details = tokenService.verifyToken(token, session);
                LOGGER.debug("Received token {}", details);
                if (details != null && details.isValid()) {
                    JCRUserNode user = userManagerService.lookupUserByPath(details.getUserPath());
                    authValveContext.setShouldStoreAuthInSession(false);
                    authValveContext.getSessionFactory().setCurrentUser(user.getJahiaUser());
                    if (permissionService != null) {
                        permissionService.addScopes(details.getScopes(), request);
                    }
                }
                return null;
            });
        }
    }

    /**
     * Check if the token authentication should be applied for the given request URI based on the configured URL patterns
     * @param requestUri the request URI to check against the configured URL patterns
     * @return true if token authentication should be applied for the request URI, false otherwise
     */
    private boolean shouldApplyTokenAuth(String requestUri) {
        return tokenConfigService.getUrlPatterns().stream().anyMatch(urlPattern -> CompositeFilter.matchFiltersURL(urlPattern, requestUri));
    }
}
