// Teardown for patTokenPermissionSetup.groovy — removes the users and roles it created.
import org.jahia.services.content.*
import org.jahia.services.usermanager.*
import javax.jcr.*

def ums = JahiaUserManagerService.getInstance()
JCRTemplate.getInstance().doExecuteWithSystemSession(null, "default", null, { JCRSessionWrapper s ->
    ["patTokenHolder", "patAdminNoToken"].each { u ->
        def user = ums.lookupUser(u)
        if (user != null) { ums.deleteUser(user.getPath(), s) }
    }
    ["patTokenHolderRole", "patAdminNoTokenRole"].each { r ->
        if (s.nodeExists("/roles/" + r)) { s.getNode("/roles/" + r).remove() }
    }
    s.save()
    return null
} as JCRCallback)
log.info("PAT_PERM_TEARDOWN: done")
