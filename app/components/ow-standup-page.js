import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { not, filterBy, gt, none, notEmpty } from '@ember/object/computed';
import { schedule } from '@ember/runloop';
import { observer } from '@ember/object';
import { on } from '@ember/object/evented';


export default Component.extend({
  store: service(),
  session: service(),
  isEditing: false,
  saveDisabled: not('session.isAuthenticated'),
  savePending: gt('dirtySaveables.length', 0),
  saveables: computed('model', 'model.topics.[]', 'model.allEntries.[]', function() {
    let model = this.get('model');
    let saveables = [model];
    saveables = saveables.concat(model.get('topics').toArray());
    saveables = saveables.concat(model.get('allEntries'));
    return saveables;
  }),
  dirtySaveables: filterBy('saveables', 'hasDirtyAttributes', true),
  saveTask: task(function * () {
    let saveables = this.get('dirtySaveables');
    yield saveables.map(saveable => saveable.save());
  }).drop(),
  autosaveTask: task(function * () {
    yield timeout(1000);
    this.get('saveTask').perform();
  }).restartable(),
  autosaveTasks: on('init', observer('savePending', function() {
    if (this.get('savePending')) {
      this.get('autosaveTask').perform();
    }
  })),
  showSummary: false,
  showForm: not('showSummary'),
  showCopyStatus: false,
  showQuestionOfTheDayButton: none('model.questionOfTheDay.question'),
  showQuestionOfTheDay: notEmpty('model.questionOfTheDay.question'),
  actions: {
    save() {
      this.set('isEditing', false);
      this.get('saveTask').perform();
    },
    toggleSummary() {
      let showingSummary = this.get('showSummary');
      if (showingSummary) {
        this.set('showCopyStatus', false);
        this.set('showSummary', false);
        return;
      }
      this.set('showSummary', true);
    },
    createQuestionOfTheDay() {
      let newQuestionOfTheDay = this.store.createRecord('question-of-the-day', {
        question: "Would you rather eat cake or ice cream?",
        owner: this.get('session.data.authenticated.uid')
      });
      let standup = this.get('model');
      standup.set('questionOfTheDay', newQuestionOfTheDay);
      newQuestionOfTheDay.save().then(function() {
        return standup.save();
      });
    },
    deleteQuestionOfTheDay() {
      let standup = this.get('model');
      let questionOfTheDay = standup.get('questionOfTheDay');
      questionOfTheDay.then((record) => {
        record.destroyRecord().then(function() {
          return standup.save();
        });
      });
    },
    createQuestionOfTheDayAnswer(questionOfTheDay, answers, afterAnswer, value) {
      let body = value === undefined ? '' : value;
      let newAnswer = this.store.createRecord('question-of-the-day-answer', {
        body: body,
        owner: this.get('session.data.authenticated.uid')
      });
      if (afterAnswer === null || afterAnswer === undefined) {
        answers.addObject(newAnswer);
      } else {
        let index = answers.indexOf(afterAnswer);
        answers.insertAt(index+1, newAnswer);
      }
      newAnswer.save().then(function() {
        return questionOfTheDay.then((record) => record.save());
      });
      this.set('isEditing', true);
    },
    deleteQuestionOfTheDayAnswer(questionOfTheDay, answer) {
      answer.destroyRecord().then((questionOfTheDay) => {
        questionOfTheDay.save();
      });
    },
    onCopy() {
      this.set('showCopyStatus', true);
    },
    createTopic(standup) {
      let newTopic = this.store.createRecord('topic', {
        subject: '',
        owner: this.get('session.data.authenticated.uid')
      });
      standup.get('topics').addObject(newTopic);
      newTopic.save().then(function() {
        return standup.save();
      });
    },
    deleteTopic(topic, standup) {
      topic.destroyRecord().then(function() {
        standup.save();
      });
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
      newEntry.save().then(function() {
        return topic.save();
      });
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
