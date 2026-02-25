package org.jahia.modules.apitokens.config;

import org.jahia.modules.apitokens.TokenConfigProvider;
import org.osgi.service.component.annotations.*;
import org.osgi.service.metatype.annotations.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Component(service = TokenConfigProvider.class, configurationPolicy = ConfigurationPolicy.REQUIRE, configurationPid = "org.jahia.modules.PersonalApiToken", immediate = true)
@Designate(ocd = TokenConfigProviderImpl.TokenConfiguration.class, factory = true)
public class TokenConfigProviderImpl implements TokenConfigProvider {

    private volatile List<String> urlPatterns;
    private volatile String pid;

    @ObjectClassDefinition(name = "Personal API Tokens - URL Pattern Configuration", description = "Configure URL patterns for token authentication")
    public @interface TokenConfiguration {

        @AttributeDefinition(name = "URL Patterns", description = "URL patterns where token authentication should be applied") String urlPatterns() default "";

        @AttributeDefinition(name = "Configuration Name", description = "Unique name for this configuration instance") String configName() default "default";
    }

    @Activate
    void activate(TokenConfiguration configuration, Map<String, ?> properties) {
        updateConfig(configuration, properties);
    }

    @Modified
    void modified(TokenConfiguration configuration, Map<String, ?> properties) {
        updateConfig(configuration, properties);
    }

    private void updateConfig(TokenConfiguration configuration, Map<String, ?> properties) {
        this.urlPatterns = Arrays.asList(configuration.urlPatterns().split(","));
        this.pid = (String) properties.get("service.pid");
    }

    @Override
    public String getPid() {
        return pid;
    }

    @Override
    public List<String> getUrlPatterns() {
        return urlPatterns;
    }
}