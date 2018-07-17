import Component from '@ember/component';
import { EKMixin, EKOnFocusMixin, keyUp } from 'ember-keyboard';
import { on } from '@ember/object/evented';
import { observer } from '@ember/object';

export default Component.extend(EKMixin, EKOnFocusMixin, {
  items: null,
  onInsertRequest: null,

  selectedIndex: 0,
  selectedItem: (function() {
    if (this.selectedIndex === -1) {
      return null;
    }
    return this.items.objectAt(this.selectedIndex);
  }).property('selectedIndex'),
  onListChange: observer('items.length', function() {
    let selected = this.get('selectedItem');
    let index = this.get('selectedIndex');
    let newIndex = this.get('items').indexOf(selected);
    if (index === newIndex) {
      this.goDown();
    } else if (newIndex == -1) {
      this.goUp();
    }
  }),
  goUp: (function() {
    if (this.get('selectedIndex') > 0) {
      this.decrementProperty('selectedIndex');
    }
  }),
  goDown: (function() {
    if (this.get('selectedIndex') < this.get('items.length') - 1) {
      this.incrementProperty('selectedIndex');
    }
  }),
  listenForUp: on(keyUp('ArrowUp'), function() {
    this.goUp();
  }),
  listenForDown: on(keyUp('ArrowDown'), function() {
    this.goDown();
  }),
  actions: {
    selectItem(item) {
      let index = this.get('items').indexOf(item);
      this.set('selectedIndex', index);
    }
  }
});
