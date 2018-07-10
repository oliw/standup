import Component from '@ember/component';
import { EKMixin, EKOnFocusMixin, keyUp } from 'ember-keyboard';
import { on } from '@ember/object/evented';
import { not } from '@ember/object/computed';

export default Component.extend(EKMixin, EKOnFocusMixin, {
  value: '',
  canSelect: true,
  canEdit: true,
  onChange: null,

  isFocused: false,
  isSelected: false,
  isEditing: false,
  isNotEditing: not('isEditing'),

  click() {
    if (this.get('canSelect') !== true) {
      return;
    }
    let notSelected = this.get('isSelected') !== true;
    if (notSelected) {
      this.set('isSelected', true);
    }
    if (this.get('canEdit')) {
      this.set('isEditing', true);
      this.$('input').focus();
    }
  },
  escape: on(keyUp('Escape'), function() {
    let selected = this.get('isSelected');
    let editing = this.get('isEditing');
    if (editing) {
      this.set('isEditing', false);
    } else if (selected) {
      this.set('isSelected', false);
    }
  }),
  actions: {
    escape() {
      this.escape();
    },
    handleChange(event) {
      event.preventDefault();
      let newValue = event.target.value;
      if (this.get('onChange')) {
        this.get('onChange')(newValue);
      }
    }
  }
});
