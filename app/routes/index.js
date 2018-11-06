import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { LocalDate, ZoneId } from "js-joda";

export default Route.extend({
  store: service(),
  session: service(),

  dayOfWeek: function() {
    const d = new Date();
    const weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    return weekday[d.getDay()];
  }.property(),

  queryParams: {
    date: {}
  },

  async model(params) {
    let date = null;
    if (params.date) {
      date = LocalDate.parse(params.date);
    } else {
      date = LocalDate.now(ZoneId.SYSTEM);
    }
    let dayOfWeek = this.get("dayOfWeek");
    let standup = null;
    if (this.get("session.data.authenticated.uid")) {
      let standups = await this.store.query("standup", {
        orderBy: "owner",
        equalTo: this.get("session.data.authenticated.uid")
      });
      standup = standups.find(s => {
        return s.get("date").equals(date);
      });
    } else {
      let standups = await this.store.findAll("standup");
      standup = standups.find(s => {
        return s.get("date").equals(date);
      });
    }
    if (standup === undefined) {
      standup = await this.get("store").createRecord("standup", {
        title: dayOfWeek,
        date: date,
        owner: this.get("session.data.authenticated.uid")
      });
    }
    return standup;
  }
});
