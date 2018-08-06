import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import { LocalDate, ZoneId } from 'js-joda';

export default Route.extend({
  store: service(),
  session: service(),
  model() {
    return RSVP.hash(
      {
        standups: this.store.query('standup', {
          orderBy: 'owner',
          equalTo: this.get('session.data.authenticated.uid')
        })
      }
    );
  },
  actions: {
    createStandup() {
      let standup = this.get('store').createRecord('standup', {
        title: 'Test',
        date: LocalDate.now(ZoneId.SYSTEM),
        owner: this.get('session.data.authenticated.uid')
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
