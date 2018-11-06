import Component from "@ember/component";
import { EKMixin, EKOnFocusMixin, keyUp } from "ember-keyboard";
import { on } from "@ember/object/evented";

export default Component.extend(EKMixin, EKOnFocusMixin, {
  onEnter: null,
  onExit: null,

  click() {
    if (this.get("onEnter")) {
      this.get("onEnter")();
    }
  },
  onEnter: on(keyUp("Enter"), function() {
    if (this.get("onEnter")) {
      this.get("onEnter")();
    }
  }),
  onEscape: on(keyUp("Escape"), function() {
    if (this.get("onExit")) {
      this.get("onExit")();
    }
  })
});
