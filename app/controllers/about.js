import Controller from "@ember/controller";
import EmberObject from "@ember/object";
import { computed } from "@ember/object";
import { alias } from "@ember/object/computed";

let ChangeLogEntry = EmberObject.extend({
  date: null,
  description: null
});

export default Controller.extend({
  standupCount: alias("model.stats.standupCount"),
  changeLogEntries: computed("model.changelog", function() {
    let model = this.get("model.changelog");
    let entries = [];
    model.forEach(rawEntry => {
      entries.push(
        ChangeLogEntry.create({
          date: rawEntry[0],
          description: rawEntry[1]
        })
      );
    });
    return entries;
  })
});
