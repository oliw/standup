import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),
  session: service(),
  actions: {
    createStandup() {
      let standup = this.store.createRecord('standup', {
        creatorId: this.session.get('data.authenticated.user.id'),
        createdAt: new Date()
      });
      standup.save();
    },
    deleteStandups() {
      this.store.findAll('standup', { backgroundReload: false}).then(standups => {
        standups.forEach(standup => {
          standup.destroyRecord();
        });
      });
    }
  }
});
