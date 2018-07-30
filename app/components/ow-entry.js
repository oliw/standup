import Component from '@ember/component';
import { EKMixin, EKOnFocusMixin, keyUp } from 'ember-keyboard';
import { on } from '@ember/object/evented';
import { not, and } from '@ember/object/computed';
import { observer, computed } from '@ember/object';

export default Component.extend(EKMixin, EKOnFocusMixin, {
  value: '',
  onChange: null,
  selected: false,
  editing: false,
  onSelectRequest: null,
  onRemoveRequest: null,

  isEditing: and('selected', 'editing'),
  isNotEditing: not('isEditing'),

  onEdit: on('init', observer('isEditing', function() {
    let isEditing = this.get('isEditing');
    if (isEditing) {
      Ember.run.schedule('afterRender', () => {
        this.$('input').focus();
      });
    } else if (this.get('selected')) {
      Ember.run.schedule('afterRender', () => {
        this.$('p.label').focus();
      });
    }
  })),
  tabIndex: computed('selected', function() {
    if (this.get('selected')) {
      return "-1";
    } else {
      return null;
    }
  }),
  handleDelete: on(keyUp('Backspace'), function() {
    let isEditing = this.get('isEditing');
    let selected = this.get('selected');
    let handler = this.get('onRemoveRequest');
    if (!handler) {
      return;
    }
    if (isEditing && this.get('value') === '') {
      let isPrimed = this.get('isPrimed');
      if (this.get('isPrimedForDeletion')) {
        handler();
        this.set('isPrimedForDeletion', false);
      } else {
        this.set('isPrimedForDeletion', true);
      }
    } else if (selected && !isEditing) {
      handler();
    }
  }),
  handleEnter: on(keyUp('Enter'), function() {
    let handler = this.get('onEnter');
    if (handler && this.get('editing')) {
      handler();
    }
  }),
  click() {
    let handler = this.get('onSelectRequest');
    if (handler) {
      handler();
    }
  },
  actions: {
    handleChange(event) {
      event.preventDefault();
      let newValue = event.target.value;
      if (this.get('onChange')) {
        this.get('onChange')(newValue);
      }
    }
  }
});
