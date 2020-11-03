/*
 * ==========================================================================================
 * =                   JAHIA'S DUAL LICENSING - IMPORTANT INFORMATION                       =
 * ==========================================================================================
 *
 *                                 http://www.jahia.com
 *
 *     Copyright (C) 2002-2020 Jahia Solutions Group SA. All rights reserved.
 *
 *     THIS FILE IS AVAILABLE UNDER TWO DIFFERENT LICENSES:
 *     1/GPL OR 2/JSEL
 *
 *     1/ GPL
 *     ==================================================================================
 *
 *     IF YOU DECIDE TO CHOOSE THE GPL LICENSE, YOU MUST COMPLY WITH THE FOLLOWING TERMS:
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 *
 *     2/ JSEL - Commercial and Supported Versions of the program
 *     ===================================================================================
 *
 *     IF YOU DECIDE TO CHOOSE THE JSEL LICENSE, YOU MUST COMPLY WITH THE FOLLOWING TERMS:
 *
 *     Alternatively, commercial and supported versions of the program - also known as
 *     Enterprise Distributions - must be used in accordance with the terms and conditions
 *     contained in a separate written agreement between you and Jahia Solutions Group SA.
 *
 *     If you are unsure which license is appropriate for your use,
 *     please contact the sales department at sales@jahia.com.
 */
package org.jahia.modules.apitokens.core;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.id.uuid.UUID;
import org.apache.commons.id.uuid.VersionFourGenerator;

import java.util.regex.Pattern;

/**
 * Simple utils class to generate manipulate token
 */
public class TokenUtils {

    private Pattern uuidPattern = Pattern.compile("[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}");
    private Base64 base64 = new Base64();
    private VersionFourGenerator generator = new VersionFourGenerator();

    private TokenUtils() {
    }

    private static class InstanceHolder {
        public static final TokenUtils instance = new TokenUtils();
    }

    public static TokenUtils getInstance() {
        return InstanceHolder.instance;
    }

    /**
     * Generate a new random token
     *
     * @return
     */
    public String generateToken() {
        byte[] b = new byte[32];
        UUID key = (UUID) generator.nextIdentifier();
        UUID secret = (UUID) generator.nextIdentifier();
        System.arraycopy(key.getRawBytes(), 0, b, 0, 16);
        System.arraycopy(secret.getRawBytes(), 0, b, 16, 16);
        return base64.encodeToString(b);
    }

    /**
     * Extract the key from the token
     *
     * @param token
     * @return
     */
    public String getKey(String token) {
        return getPart(token, 0, 16);
    }

    /**
     * Extract the secret part from the token
     *
     * @param token
     * @return
     */
    public String getSecret(String token) {
        return getPart(token, 16, 16);
    }

    /**
     * Check if the key is in valid format
     *
     * @param key
     * @return
     */
    public boolean checkKeyFormat(String key) {
        return uuidPattern.matcher(key).matches();
    }

    /**
     * Check if the secret is in valid format
     *
     * @param secret
     * @return
     */
    public boolean checkSecretFormat(String secret) {
        return uuidPattern.matcher(secret).matches();
    }

    private String getPart(String token, int offset, int length) {
        byte[] b = base64.decode(token);
        byte[] part = new byte[16];

        System.arraycopy(b, offset, part, 0, length);

        return new UUID(part).toString();
    }

}
