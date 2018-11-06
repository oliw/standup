import Component from "@ember/component";

export default Component.extend({
  classNames: ["draggableDropzone"],
  classNameBindings: ["dragClass"],
  dragClass: "deactivated",
  onDrop: null,

  dragLeave(event) {
    event.preventDefault();
    this.set("dragClass", "deactivated");
  },

  dragOver(event) {
    event.preventDefault();
    this.set("dragClass", "activated");
  },

  drop(event) {
    let data = event.dataTransfer.getData("text/data");
    this.get("onDrop")(data);
    this.set("dragClass", "deactivated");
  }
});
