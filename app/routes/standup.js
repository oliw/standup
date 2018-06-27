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
    },
    createYesterdayEntry(topic) {
      let newEntry = this.store.createRecord('entry', {
        body: `new entry at ${Math.floor((Math.random() * 10000) + 1)}`
      });
      topic.get('yesterdays').addObject(newEntry);
      newEntry.save().then(function() {
        return topic.save();
      });
    },
    saveEntry(entry) {
      entry.save();
    },
    deleteEntry(topic, entry) {
      entry.destroyRecord().then(function() {
        topic.save();
      });
    },
  }
});
