import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),

  model(params) {
    return this.store.findRecord('standup', params.id);
  },
  actions: {
    willTransition(transition) {
      if (this.controller.get('savePending') &&
        !confirm('You have unsaved changes, are you sure you want to leave?')) {
        transition.abort();
      } else {
        // Bubble the `willTransition` action so that
        // parent routes can decide whether or not to abort.
        return true;
      }
    }
  }
});
