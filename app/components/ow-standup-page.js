import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { not } from '@ember/object/computed';

export default Component.extend({
  store: service(),
  session: service(),
  isEditing: false,
  saveDisabled: not('session.isAuthenticated'),
  savePending: alias('model.hasDirtyAttributesAndRelationships'),
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
    saveables.push(model);
    yield saveables.map(saveable => saveable.save());
  }).drop(),
  actions: {
    save() {
      this.set('isEditing', false);
      this.get('saveTask').perform();
    },
    createTopic(standup) {
      let newTopic = this.store.createRecord('topic', {
        subject: '',
        owner: this.get('session.data.authenticated.uid')
      });
      standup.get('topics').addObject(newTopic);
    },
    createEntry(topic, entries, afterEntry, value) {
      let body = value === undefined ? '' : value;
      let newEntry = this.store.createRecord('entry', {
        body: body,
        owner: this.get('session.data.authenticated.uid')
      });
      if (afterEntry === null || afterEntry === undefined) {
        entries.addObject(newEntry);
      } else {
        let index = entries.indexOf(afterEntry);
        entries.insertAt(index+1, newEntry);
      }
      this.set('isEditing', true);
    },
    deleteEntry(topic, entry) {
      entry.destroyRecord().then(function() {
        topic.save();
      });
    },
    enableEditing() {
      this.set('isEditing', true);
    },
    disableEditing() {
      this.set('isEditing', false);
    }
  }
});
