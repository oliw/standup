import Controller from '@ember/controller';
import { task } from 'ember-concurrency';

export default Controller.extend({
  isSaving: false,
  saveTask: task(function * () {
    let model = this.get('model');
    let saveables = [];
    model.get('topics').forEach(topic => {
      topic.get('yesterdays').forEach(entry => {
        saveables.push(entry);
      });
      topic.get('todays').forEach(entry => {
        saveables.push(entry);
      });
      topic.get('blockers').forEach(entry => {
        saveables.push(entry);
      });
      saveables.push(topic);
    });
    yield saveables.map(saveable => saveable.save());
  }).drop(),
  actions: {
    save() {
      this.get('saveTask').perform();
    },
    createTopic(standup) {
      let newTopic = this.store.createRecord('topic', {
        subject: 'untitled'
      });
      standup.get('topics').addObject(newTopic);
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
    },
    deleteEntry(topic, entry) {
      entry.destroyRecord().then(function() {
        topic.save();
      });
    },
  }
});
