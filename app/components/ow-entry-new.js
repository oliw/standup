import Component from "@ember/component";

export default Component.extend({
  click() {
    this.get("onClick")();
  },
  actions: {
    handleChange(event) {
      event.preventDefault();
      let newValue = event.key;
      this.get("onClick")(newValue);
    }
  }
});
