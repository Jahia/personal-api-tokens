// Self-contained fixture for the personal API token mutation-permission spec.
// Creates two server roles and two users so the spec can assert that the token
// mutations consistently require the "personal-api-tokens" permission:
//   patTokenHolder  -> role with the personal-api-tokens permission (may manage tokens)
//   patAdminNoToken -> privileged admin role WITHOUT personal-api-tokens (may reach the
//                      admin subtree but must not manage tokens)
// Idempotent; paired with patTokenPermissionTeardown.groovy.
import org.jahia.services.content.*
import org.jahia.services.usermanager.*
import javax.jcr.*

def out = new StringBuilder("\n")
def ums = JahiaUserManagerService.getInstance()

def makeRole = { JCRSessionWrapper s, String name, List perms ->
    def roles = s.getNode("/roles")
    def role = roles.hasNode(name) ? roles.getNode(name) : roles.addNode(name, "jnt:role")
    role.setProperty("j:nodeTypes", (String[]) ["rep:root"])
    role.setProperty("j:permissionNames", (String[]) perms.toArray(new String[0]))
    role.setProperty("j:privilegedAccess", true)
    role.setProperty("j:roleGroup", "server-role")
}

JCRTemplate.getInstance().doExecuteWithSystemSession(null, "default", null, { JCRSessionWrapper s ->
    makeRole(s, "patTokenHolderRole", ["administrationAccess", "adminUsers", "personal-api-tokens"])
    makeRole(s, "patAdminNoTokenRole", ["administrationAccess", "adminUsers", "admin-personal-api-tokens"])
    s.save()
    ["patTokenHolder":"PatHolder123!", "patAdminNoToken":"PatNoToken123!"].each { u, p ->
        if (ums.lookupUser(u) == null) { ums.createUser(u, p, new java.util.Properties(), s) }
    }
    s.save()
    s.getNode("/").grantRoles("u:patTokenHolder", new java.util.HashSet(["patTokenHolderRole"]))
    s.getNode("/").grantRoles("u:patAdminNoToken", new java.util.HashSet(["patAdminNoTokenRole"]))
    s.save()
    out.append("patTokenPermissionSetup OK")
    return null
} as JCRCallback)
log.info("PAT_PERM_SETUP: " + out.toString())
