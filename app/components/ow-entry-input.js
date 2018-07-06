import TextField from '@ember/component/text-field';
import { EKMixin, EKOnFocusMixin, keyUp } from 'ember-keyboard';

export default TextField.extend(EKMixin, {
  onUp: (function() {
    alert('hi');
  }).on(keyUp('ArrowUp'))
});
