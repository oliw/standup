import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { on } from "@ember/object/evented";

export default Route.extend({
  store: service(),

  model(params) {
    return this.store.findRecord("standup", params.id);
  },

  onUnloadMethod: () => {
    if (this.controller.get("savePending")) {
      return "You have unsaved changes, are you sure you want to leave?";
    }
  },

  onUnload: on("init", function() {
    $(window).bind("beforeunload", this.onUnloadMethod);
  }),

  actions: {
    willTransition(transition) {
      if (
        this.controller.get("savePending") &&
        !confirm("You have unsaved changes, are you sure you want to leave?")
      ) {
        transition.abort();
      } else {
        $(window).unbind("beforeunload", this.onUnloadMethod);
        // Bubble the `willTransition` action so that
        // parent routes can decide whether or not to abort.
        return true;
      }
    }
  }
});
