import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),

  model(params) {
    return this.store.findRecord('standup', params.id);
  },
  actions: {
    createTopic(standup) {
      let newTopic = this.store.createRecord('topic', {
        subject: 'untitled'
      });
      standup.get('topics').addObject(newTopic);
      newTopic.save().then(function() {
        return standup.save();
      });
    }
  }
});
