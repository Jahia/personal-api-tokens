package org.jahia.modules.apitokens;
import java.util.List;

public interface TokenConfigProvider {
    String getPid();
    List<String> getUrlPatterns();
}