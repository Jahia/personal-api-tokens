/*
 * ==========================================================================================
 * =                            JAHIA'S ENTERPRISE DISTRIBUTION                             =
 * ==========================================================================================
 *
 *                                  http://www.jahia.com
 *
 * JAHIA'S ENTERPRISE DISTRIBUTIONS LICENSING - IMPORTANT INFORMATION
 * ==========================================================================================
 *
 *     Copyright (C) 2002-2021 Jahia Solutions Group. All rights reserved.
 *
 *     This file is part of a Jahia's Enterprise Distribution.
 *
 *     Jahia's Enterprise Distributions must be used in accordance with the terms
 *     contained in the Jahia Solutions Group Terms & Conditions as well as
 *     the Jahia Sustainable Enterprise License (JSEL).
 *
 *     For questions regarding licensing, support, production usage...
 *     please contact our team at sales@jahia.com or go to http://www.jahia.com/license.
 *
 * ==========================================================================================
 */
package org.jahia.modules.apitokens.config;

import org.jahia.modules.apitokens.TokenConfigProvider;
import org.jahia.modules.apitokens.TokenConfigService;
import org.osgi.framework.ServiceReference;
import org.osgi.service.component.annotations.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServlet;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component(service = TokenConfigService.class, immediate = true)
public class TokenConfigServiceImpl implements TokenConfigService {

    @Reference(service = HttpServlet.class,
               target = "(allow-api-token=true)",
               cardinality = ReferenceCardinality.MULTIPLE,
               policy = ReferencePolicy.DYNAMIC,
               policyOption = ReferencePolicyOption.GREEDY,
               bind = "addServlet",
               unbind = "removeServlet")
    public void addServlet(ServiceReference<HttpServlet> servlet) {
        servletPatterns.add("/modules" + servlet.getProperty("alias"));
        rebuildUrlPatterns();
    }

    public void removeServlet(ServiceReference<HttpServlet> servlet) {
        servletPatterns.remove("/modules" + servlet.getProperty("alias"));
        rebuildUrlPatterns();
    }

    public static final Logger LOGGER = LoggerFactory.getLogger(TokenConfigServiceImpl.class);


    private final Set<String> urlPatterns = new HashSet<>();

    private final Map<String, List<String>> patternsByConfigPid = new ConcurrentHashMap<>();

    private final Set<String> servletPatterns = new HashSet<>();

    @Reference(service = TokenConfigProvider.class,
               cardinality = ReferenceCardinality.MULTIPLE,
               policy = ReferencePolicy.DYNAMIC,
               policyOption = ReferencePolicyOption.GREEDY,
               bind = "addProvider",
               unbind = "removeProvider",
               updated = "modifiedProvider")
    void addProvider(TokenConfigProvider provider) {
        patternsByConfigPid.put(provider.getPid(), new ArrayList<>(provider.getUrlPatterns()));
        rebuildUrlPatterns();
        LOGGER.info("Added token config provider: {}", provider.getPid());
    }

    void removeProvider(TokenConfigProvider provider) {
        patternsByConfigPid.remove(provider.getPid());
        rebuildUrlPatterns();
        LOGGER.info("Removed token config provider: {}", provider.getPid());
    }

    void modifiedProvider(TokenConfigProvider provider) {
        patternsByConfigPid.put(provider.getPid(), new ArrayList<>(provider.getUrlPatterns()));
        rebuildUrlPatterns();
        LOGGER.info("Modified token config provider: {}", provider.getPid());
    }

    private void rebuildUrlPatterns() {
        urlPatterns.clear();
        patternsByConfigPid.values().forEach(urlPatterns::addAll);
        urlPatterns.addAll(servletPatterns);
    }

    @Activate
    public void activate() {
        LOGGER.info("Token configuration is ready");
    }

    @Deactivate
    public void deactivate() {
        LOGGER.info("Token configuration is deactivated");
    }

    @Override
    public Set<String> getUrlPatterns() {
        return urlPatterns;
    }
}
