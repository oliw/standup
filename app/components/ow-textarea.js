import TextArea from '@ember/component/text-area';
import * as autosize from 'autosize';
import { on } from '@ember/object/evented';
import { observer } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';

export default TextArea.extend({
  rows: 1,
  initializeAutosize: on('didInsertElement', function() {
    autosize(this.$());
  }),
  removeAutosize: on('willDestroyElement', function() {
    autosize.destroy(this.$());
  }),
  valueChanged: observer('value', function() {
    scheduleOnce('afterRender', () => {
      autosize.update(this.$());
    });
  })
});
