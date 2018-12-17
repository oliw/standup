import Controller from "@ember/controller";
import EmberObject from "@ember/object";
import { computed } from "@ember/object";

let ChangeLogEntry = EmberObject.extend({
  date: null,
  description: null
});

export default Controller.extend({
  changeLogEntries: computed("model", function() {
    let model = this.get("model");
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
