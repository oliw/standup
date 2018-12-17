import Route from "@ember/routing/route";
import ApplicationRouteMixin from "ember-simple-auth/mixins/application-route-mixin";
import { inject as service } from "@ember/service";
import RSVP from "rsvp";

export default Route.extend(ApplicationRouteMixin, {
  session: service(),
  changelog: service(),
  routeAfterAuthentication: "authenticated.dashboard",
  async model() {
    let latestVersion = await this.changelog.fetchLatestVersion();
    let latestVersionSeen = this.changelog.getLatestVersionSeen();
    return RSVP.hash({
      newVersionAvailable: latestVersion > latestVersionSeen
    });
  }
});
