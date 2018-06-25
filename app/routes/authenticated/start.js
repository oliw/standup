import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),
  session: service(),
  model() {
    return RSVP.hash(
      {
        standups: this.store.findAll('standup')
      }
    );
  },
  actions: {
    createStandup() {
      let standup = this.get('store').createRecord('standup', {
        title: 'Test'
      });
      standup.save().then((success) => {
        this.refresh();
      });
    },
    deleteStandup(standup) {
      standup.destroyRecord().then((success) => {
        this.refresh();
      });
    }
  }
});
