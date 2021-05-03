org.jahia.services.content.JCRTemplate.getInstance().doExecuteWithSystemSession({ session ->
    org.jahia.osgi.BundleUtils.getOsgiService("org.jahia.modules.apitokens.TokenService")
            .tokenBuilder("/users/root", "auth-token", session)
            .setToken("Lfh/02b1SbuZX/u1JFqegMEljMZaPGbsqJf3ALY0AGo=")
            .setActive(true)
            .create()
    session.save();
})
