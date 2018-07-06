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
    this.decrementProperty('selectedIndex');
  }).on(keyUp('ArrowUp')),
  goDown: (function() {
    this.incrementProperty('selectedIndex');
  }).on(keyUp('ArrowDown')),
});
