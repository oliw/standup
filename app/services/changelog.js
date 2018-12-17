import Service from "@ember/service";
import { LocalDate } from "js-joda";

const DEFAULT_DATE = "1990-01-01";

export default Service.extend({
  getLatestVersionSeen() {
    let dateStr = DEFAULT_DATE;
    if (localStorage.latestAppVersion) {
      dateStr = localStorage.latestAppVersion;
    }
    return LocalDate.parse(dateStr);
  },
  setLatestVersionSeen(version) {
    localStorage.setItem("latestAppVersion", version.toString());
  },

  async fetchLatestVersion() {
    let changelog = await this.fetchChangelog();
    let maximumDate = LocalDate.parse(DEFAULT_DATE);
    changelog.forEach(entry => {
      let dateStr = entry[0];
      let date = LocalDate.parse(dateStr);
      if (date > maximumDate) {
        maximumDate = date;
      }
    });
    return maximumDate;
  },
  async fetchChangelog() {
    let response = await fetch(
      "https://raw.githubusercontent.com/oliw/standup/master/changelog.txt"
    );
    let text = await response.text();
    let lines = text.split("\n");
    let data = [];
    lines.forEach(line => {
      // 2018-12-10 My comment goes here
      let regex = /(\d\d\d\d-\d\d?-\d\d?) (.*)/;
      let parts = line.split(regex);
      let datePart = parts[1];
      let descriptionPart = parts[2];
      if (line !== "") {
        data.push([datePart, descriptionPart]);
      }
    });
    return data;
  }
});
