import Component from '@ember/component';
import { EKMixin, EKOnFocusMixin, keyUp } from 'ember-keyboard';

export default Component.extend(EKMixin, EKOnFocusMixin, {
  isFocused: false,
  focusIn() {
    this.set('isFocused', true);
  },
  focusOut() {
    this.set('isFocused', false);
  },
  click() {
    this.$('input').focus();
  },
  onEscape: (function() {
    this.sendAction('loseFocus');
  }).on(keyUp('Escape')),
  actions: {
    loseFocus() {
      this.$('input').blur();
    },
    keyUp(value, event) {
      return true;
    }
  }
});
