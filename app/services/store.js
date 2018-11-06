import DS from "ember-data";
import { getOwner } from "@ember/application";
import { inject as service } from "@ember/service";
import { alias } from "@ember/object/computed";

const ALWAYS_FIREBASE = ["feedback"];

export default DS.Store.extend({
  session: service(),
  loggedIn: alias("session.isAuthenticated"),
  adapterFor(modelName) {
    let owner = getOwner(this);
    let persistenceLayer = "";
    if (this.get("loggedIn") || ALWAYS_FIREBASE.includes(modelName)) {
      return owner.lookup("adapter:firebase");
    } else {
      return owner.lookup("adapter:localstorage");
    }
  }
});
