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

import org.jahia.api.content.JCRTemplate;
import org.jahia.api.usermanager.JahiaUserManagerService;
import org.jahia.modules.apitokens.TokenDetails;
import org.jahia.modules.apitokens.TokenService;
import org.jahia.services.content.JCRContentUtils;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRSessionWrapper;
import org.jahia.services.content.decorator.JCRUserNode;
import org.jahia.services.usermanager.JahiaUser;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.query.Query;

@Component(immediate = true, service = TokenService.class)
public class TokensServiceImpl implements TokenService {

    private static final String TOKENS = "tokens";

    private JCRTemplate jcrTemplate;
    private JahiaUserManagerService userManagerService;

    @Reference
    public void setJcrTemplate(JCRTemplate jcrTemplate) {
        this.jcrTemplate = jcrTemplate;
    }

    @Reference
    public void setUserManagerService(JahiaUserManagerService userManagerService) {
        this.userManagerService = userManagerService;
    }

    public String createToken(TokenDetails tokenDetails) {
        String token = TokenUtils.getInstance().generateToken();

        String key = TokenUtils.getInstance().getKey(token);
        String digestedSecret = TokenUtils.getInstance().getDigestedSecret(token);

        try {
            JCRSessionWrapper currentUserSession = jcrTemplate.getSessionFactory().getCurrentUserSession();
            JCRUserNode userNode = userManagerService.lookupUser(tokenDetails.getUserId(), currentUserSession);
            if (userNode == null) {
                throw new IllegalArgumentException("invalid user");
            }

            JCRNodeWrapper tokens = userNode.hasNode(TOKENS) ? userNode.getNode(TOKENS) : userNode.addNode(TOKENS, "patnt:tokens");
            JCRNodeWrapper tokenNode = tokens.addNode(key, "patnt:token");
            tokenNode.setProperty("digest", digestedSecret);
            tokenNode.setProperty("active", tokenDetails.isActive());
            tokenNode.setProperty("expirationDate", tokenDetails.getExpirationDate());

            currentUserSession.save();
        } catch (RepositoryException e) {
            e.printStackTrace();
        }

        return token;
    }

    public JahiaUser getUser(String token) {
        String key = TokenUtils.getInstance().getKey(token);

        try {
            JCRSessionWrapper currentUserSession = jcrTemplate.getSessionFactory().getCurrentUserSession();
            Query q = currentUserSession.getWorkspace().getQueryManager().createQuery("select * from [patnt:token] where localname()=\""+ JCRContentUtils.sqlEncode(key)+"\"", Query.JCR_SQL2);
            NodeIterator ni = q.execute().getNodes();
            if (ni.hasNext()) {
                JCRNodeWrapper node = (JCRNodeWrapper) ni.nextNode();

                String digestedSecret = TokenUtils.getInstance().getDigestedSecret(token);
                if (digestedSecret.equals(node.getProperty("digest").getString())) {
                    JCRNodeWrapper parent = node.getParent().getParent();
                    if (parent.isNodeType("jnt:user")) {
                        return ((JCRUserNode)parent).getJahiaUser();
                    }
                }
            }
        } catch (RepositoryException e) {
            e.printStackTrace();
        }

        return null;
    }

}
