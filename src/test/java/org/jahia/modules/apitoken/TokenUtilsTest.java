package org.jahia.modules.apitoken;

import org.jahia.modules.apitokens.core.TokenUtils;
import org.junit.Test;
import static org.junit.Assert.*;

public class TokenUtilsTest {

    @Test
    public void testToken() {
        TokenUtils tokenUtils = TokenUtils.getInstance();
        String token = tokenUtils.generateToken();
        assertTrue(tokenUtils.checkKeyFormat(tokenUtils.getKey(token)));
        assertTrue(tokenUtils.getSecret(token).length == 16);
    }
}
