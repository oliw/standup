import Component from '@ember/component';
import { EKMixin, EKOnFocusMixin, keyUp } from 'ember-keyboard';
import { on } from '@ember/object/evented';

export default Component.extend(EKMixin, EKOnFocusMixin, {
  editing: false,

  click() {
    this.set('editing', true);
  },
  onEnter: on(keyUp('Enter'), function() {
    this.set('editing', true);
  }),
  onEscape: on(keyUp('Escape'), function() {
    this.set('editing', false);
  })
});
