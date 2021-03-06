package org.jahia.modules.apitoken;

import org.jahia.modules.apitokens.core.TokenUtils;
import org.junit.Test;
import static org.junit.Assert.*;

public class TokenUtilsTest {

    @Test
    public void testToken() {
        TokenUtils tokenUtils = TokenUtils.getInstance();
        String token = tokenUtils.generateToken();
        assertEquals("Invalid secret", 16, tokenUtils.getSecret(token).length);
    }
}
