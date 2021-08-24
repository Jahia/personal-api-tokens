package org.jahia.modules.apitokens.graphql;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import org.jahia.services.securityfilter.ScopeDefinition;

@GraphQLDescription("API Scope")
public class GqlScope {

    private ScopeDefinition scope;

    public GqlScope(ScopeDefinition scope) {
        this.scope = scope;
    }

    @GraphQLField
    @GraphQLDescription("The name of the scope")
    public String getName() {
        return scope.getScopeName();
    }

    @GraphQLField
    @GraphQLDescription("The description of the scope")
    public String getDescription() {
        return scope.getDescription();
    }

}
