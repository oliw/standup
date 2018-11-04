import Component from '@ember/component';

export default Component.extend({
  classNames        : [ 'draggableItem' ],
  attributeBindings : [ 'draggable' ],
  draggable         : 'true',

  dragStart(event) {
    return event.dataTransfer.setData('text/data', this.get('content'));
  }
});
