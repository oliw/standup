import Controller from '@ember/controller';

export default Controller.extend({
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
    createEntry(topic, entries, afterEntry) {
      let newEntry = this.store.createRecord('entry', {
        body: `new entry at ${Math.floor((Math.random() * 10000) + 1)}`
      });
      if (afterEntry === null) {
        entries.addObject(newEntry);
      } else {
        let index = entries.indexOf(afterEntry);
        entries.insertAt(index+1, newEntry);
      }
      newEntry.save().then(function() {
        return topic.save();
      });
    },
    saveTopic(topic) {
      topic.save();
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
