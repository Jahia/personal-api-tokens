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

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.codec.digest.MessageDigestAlgorithms;
import org.apache.commons.id.uuid.UUID;
import org.apache.commons.id.uuid.VersionFourGenerator;

import java.security.SecureRandom;
import java.util.regex.Pattern;

/**
 * Simple utils class to generate manipulate token
 */
public final class TokenUtils {
    private static final int KEY_SIZE = 16;
    private static final int SECRET_SIZE = 16;
    private Pattern uuidPattern = Pattern.compile("[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}");
    private Base64 base64 = new Base64();
    private SecureRandom random = new SecureRandom();
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
     * @return token
     */
    public String generateToken() {
        byte[] b = new byte[KEY_SIZE + SECRET_SIZE];
        UUID key = (UUID) generator.nextIdentifier();
        byte[] secret = new byte[SECRET_SIZE];
        random.nextBytes(secret);
        System.arraycopy(key.getRawBytes(), 0, b, 0, KEY_SIZE);
        System.arraycopy(secret, 0, b, KEY_SIZE, SECRET_SIZE);
        return base64.encodeToString(b);
    }

    /**
     * Extract the key from the token
     *
     * @param token token
     * @return key
     */
    public String getKey(String token) {
        return new UUID(getPart(token, 0, KEY_SIZE)).toString();
    }

    /**
     * Extract the secret part from the token
     *
     * @param token token
     * @return secret
     */
    public byte[] getSecret(String token) {
        return getPart(token, KEY_SIZE, SECRET_SIZE);
    }

    /**
     * Get digested secret from token
     *
     * @param token token
     * @return digested secret
     */
    public String getDigestedSecret(String token) {
        byte[] part = getPart(token, KEY_SIZE, SECRET_SIZE);
        byte[] digested = DigestUtils.getDigest(MessageDigestAlgorithms.SHA_256).digest(part);

        return base64.encodeAsString(digested);
    }

    /**
     * Check if the key is in valid format
     *
     * @param key key
     * @return if valid
     */
    public boolean checkKeyFormat(String key) {
        return uuidPattern.matcher(key).matches();
    }

    private byte[] getPart(String token, int offset, int length) {
        byte[] b = base64.decode(token);
        byte[] part = new byte[length];
        if (b.length >= offset + length) {
            System.arraycopy(b, offset, part, 0, length);
        }

        return part;
    }

}
