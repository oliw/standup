import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  showFeedbackForm: false,
  store: service(),
  feedback: null,
  actions: {
    showFeedback() {
      let existingFeedback = this.get('feedback');
      if (existingFeedback !== null) {
        existingFeedback.rollbackAttributes();
      }
      let newFeedback = this.get('store').createRecord('feedback');
      this.set('feedback', newFeedback);
      this.set('showFeedbackForm', true);
    },
    submitFeedback() {
      let feedback = this.get('feedback');
      feedback.save().then(() => {
        this.set('showFeedbackForm', false);
      });
    },
    dismissFeedback() {
      let existingFeedback = this.get('feedback');
      if (existingFeedback !== null) {
        existingFeedback.rollbackAttributes();
      }
      this.set('showFeedbackForm', false);
    }
  }
});
