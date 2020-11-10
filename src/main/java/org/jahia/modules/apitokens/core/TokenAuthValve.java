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
import org.jahia.modules.apitokens.TokenDetails;
import org.jahia.modules.apitokens.TokenService;
import org.jahia.params.valves.AuthValveContext;
import org.jahia.params.valves.BaseAuthValve;
import org.jahia.pipelines.Pipeline;
import org.jahia.pipelines.PipelineException;
import org.jahia.pipelines.valves.Valve;
import org.jahia.pipelines.valves.ValveContext;
import org.jahia.services.content.JCRTemplate;
import org.jahia.services.content.decorator.JCRUserNode;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ServiceScope;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Map;

/**
 * Authentication valve for APIToken Authorization header
 */
@Component(service = Valve.class, immediate = true, scope = ServiceScope.SINGLETON)
public class TokenAuthValve extends BaseAuthValve {
    public static final String API_TOKEN = "APIToken";
    private static final Logger logger = LoggerFactory.getLogger(TokenAuthValve.class);
    private Pipeline authPipeline;
    private TokenService tokenService;
    private JahiaUserManagerService userManagerService;

    private String[] urlPatterns = null;

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

    /**
     * Activate
     *
     * @param props Configuration properties
     */
    @Activate
    public void activate(Map<String, ?> props) {
        setId("patValve");
        if (props.get("urlPatterns") != null) {
            urlPatterns = StringUtils.split((String) props.get("urlPatterns"), ",");
        }
        removeValve(authPipeline);
        addValve(authPipeline, 0, null, null);
    }

    @Override
    public void invoke(Object o, ValveContext valveContext) throws PipelineException {
        AuthValveContext authValveContext = (AuthValveContext) o;
        HttpServletRequest request = authValveContext.getRequest();

        String uri = request.getRequestURI().substring(request.getContextPath().length());

        if (Arrays.stream(urlPatterns).anyMatch(urlPattern -> CompositeFilter.matchFiltersURL(urlPattern, uri))) {
            String authorization = request.getHeader("Authorization");
            try {
                JCRUserNode user = authenticate(authorization);
                if (user != null) {
                    authValveContext.getSessionFactory().setCurrentUser(user.getJahiaUser());
                    return;
                }

            } catch (RepositoryException e) {
                throw new PipelineException(e);
            }
        }

        valveContext.invokeNext(o);
    }

    private JCRUserNode authenticate(String authorization) throws RepositoryException {
        if (authorization != null && authorization.contains(API_TOKEN)) {
            String token = StringUtils.substringAfter(authorization, API_TOKEN).trim();

            return JCRTemplate.getInstance().doExecuteWithSystemSession(session -> {
                TokenDetails details = tokenService.verifyToken(token, session);
                logger.debug("Received token {}", details);
                if (details != null && details.isValid()) {
                    return userManagerService.lookupUserByPath(details.getUserPath());
                }

                return null;
            });
        }

        return null;
    }
}
