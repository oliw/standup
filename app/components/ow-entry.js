import Component from "@ember/component";
import { EKMixin, EKOnFocusMixin, keyUp } from "ember-keyboard";
import { on } from "@ember/object/evented";
import { not, and } from "@ember/object/computed";
import { observer, computed } from "@ember/object";

export default Component.extend(EKMixin, EKOnFocusMixin, {
  value: "",
  onChange: null,
  selected: false,
  editable: false,
  onSelectRequest: null,
  onRemoveRequest: null,
  isEditing: and("selected", "editable"),
  isNotEditing: not("isEditing"),
  onInsert: on("didInsertElement", function() {
    let isSelected = this.get("selected");
    if (isSelected) {
      Ember.run.schedule("afterRender", () => {
        this.$("textArea").focus();
      });
    }
  }),
  onSelect: observer("selected", function() {
    if (!this.get("selected")) {
      return;
    }
    Ember.run.schedule("afterRender", () => {
      this.$("textArea").focus();
    });
  }),
  tabIndex: computed("selected", function() {
    if (this.get("selected")) {
      return "-1";
    } else {
      return null;
    }
  }),
  click() {
    let handler = this.get("onSelectRequest");
    if (handler) {
      handler();
    }
  },
  actions: {
    handleChange(newValue) {
      if (this.get("onChange")) {
        this.get("onChange")(newValue);
      }
    },
    handleEnter() {
      let handler = this.get("onEnter");
      if (handler && this.get("editable")) {
        handler();
      }
    },
    handleDelete() {
      let handler = this.get("onRemoveRequest");
      if (!handler) {
        return;
      }
      if (this.get("value") === "") {
        handler();
      }
    }
  }
});
