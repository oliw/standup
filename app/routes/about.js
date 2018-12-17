import Route from "@ember/routing/route";
import { LocalDate } from "js-joda";
import { inject as service } from "@ember/service";

export default Route.extend({
  changelog: service(),
  async model() {
    let latestVersion = await this.changelog.fetchLatestVersion();
    this.changelog.setLatestVersionSeen(latestVersion);
    let changelog = await this.changelog.fetchChangelog();
    return changelog;
  }
});
