import Component from '@ember/component';
import { EKMixin, EKOnFocusMixin, keyUp } from 'ember-keyboard';

export default Component.extend(EKMixin, EKOnFocusMixin, {
  items: null,
  selectedIndex: 0,
  selectedItem: (function() {
    if (this.selectedIndex === -1) {
      return null;
    }
    return this.items.get(this.selectedIndex);
  }).property('items.[]', 'selectedIndex'),
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
  actions: {
    selectPrevious() {
      this.goUp();
    },
    selectNext() {
      this.goDown();
    },
    selectItem(item) {
      let index = this.get('items').indexOf(item);
      this.set('selectedIndex', index);
    }
  }
});
