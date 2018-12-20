import Route from "@ember/routing/route";
import { LocalDate } from "js-joda";
import RSVP from "rsvp";
import { inject as service } from "@ember/service";

export default Route.extend({
  changelog: service(),
  store: service(),
  async model() {
    let latestVersion = await this.changelog.fetchLatestVersion();
    this.changelog.setLatestVersionSeen(latestVersion);
    let changelog = await this.changelog.fetchChangelog();
    let stats = await this.store.findRecord("stats", 1);
    //let stats = null;
    if (stats === null) {
      stats = this.get("store").createRecord("stats", {
        id: 1,
        standupCount: 0
      });
    }
    stats.save();
    return RSVP.hash({
      changelog: changelog,
      stats: stats
    });
  }
});
