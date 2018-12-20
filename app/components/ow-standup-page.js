import Component from "@ember/component";
import { task, timeout } from "ember-concurrency";
import { computed } from "@ember/object";
import { alias } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import {
  sort,
  not,
  filterBy,
  gt,
  none,
  notEmpty
} from "@ember/object/computed";
import { schedule } from "@ember/runloop";
import { observer } from "@ember/object";
import { on } from "@ember/object/evented";
import DS from "ember-data";

export default Component.extend({
  store: service(),
  session: service(),
  questionOfTheDay: service(),
  isEditing: false,
  saveDisabled: not("session.isAuthenticated"),
  savePending: gt("dirtySaveables.length", 0),
  saveables: computed(
    "model",
    "model.topics.[]",
    "model.allEntries.[]",
    "model.questionOfTheDay",
    "model.questionOfTheDay.answers.@each.value",
    function() {
      let collectSaveables = async () => {
        let saveables = [this.get("model")];
        let topics = await this.get("model.topics").toArray();
        let entries = await this.get("model.allEntries");
        saveables = saveables.concat(topics);
        saveables = saveables.concat(entries);
        let questionOfTheDay = await this.get("model.questionOfTheDay");
        if (questionOfTheDay !== null) {
          saveables = saveables.concat([questionOfTheDay]);
          let answers = await questionOfTheDay.get("answers").toArray();
          saveables = saveables.concat(answers);
        }
        return saveables;
      };

      return DS.PromiseArray.create({
        promise: collectSaveables()
      });
    }
  ),
  dirtySaveables: filterBy("saveables", "hasDirtyAttributes", true),
  saveTask: task(function*() {
    let saveables = this.get("dirtySaveables");
    yield saveables.map(saveable => saveable.save());
  }).drop(),
  autosaveTask: task(function*() {
    yield timeout(1000);
    this.get("saveTask").perform();
  }).restartable(),
  autosaveTasks: on(
    "init",
    observer("savePending", function() {
      if (this.get("savePending")) {
        this.get("autosaveTask").perform();
      }
    })
  ),
  showSummary: false,
  showForm: not("showSummary"),
  showCopyStatus: false,
  showQuestionOfTheDayButton: none("model.questionOfTheDay.question"),
  showQuestionOfTheDay: notEmpty("model.questionOfTheDay.question"),
  sortedTopicsOrdering: ["sortOrder"],
  sortedTopics: sort("model.topics", "sortedTopicsOrdering"),
  importTopicsTask: task(function*() {
    let standup = this.get("model");
    let date = standup.get("date");
    let yesterday = date.minusDays(1);
    let matches = yield this.store.query("standup", {
      date: yesterday.toString()
    });
    if (matches.get("length") === 0) {
      return;
    }
    let previousStandup = matches.get("firstObject");
    let previousTopics = yield previousStandup.get("topics");

    previousTopics.forEach(topic => {
      let newTopic = this.store.createRecord("topic", {
        subject: topic.get("subject"),
        owner: this.get("session.data.authenticated.uid")
      });
      standup.get("topics").addObject(newTopic);
      newTopic.save().then(function() {
        return standup.save();
      });
    });
  }),
  logNewStandup() {
    this.get("store")
      .findRecord("stats", 1)
      .then(stats => {
        stats.incrementProperty("standupCount");
        stats.save();
      });
  },
  actions: {
    save() {
      this.set("isEditing", false);
      this.get("saveTask").perform();
    },
    toggleSummary() {
      let showingSummary = this.get("showSummary");
      if (showingSummary) {
        this.set("showCopyStatus", false);
        this.set("showSummary", false);
        return;
      }
      this.set("showSummary", true);
    },
    createQuestionOfTheDay() {
      let questionOfTheDayService = this.get("questionOfTheDay");
      let newQuestionOfTheDay = this.store.createRecord("question-of-the-day", {
        question: questionOfTheDayService.generateRandomQuestion(),
        owner: this.get("session.data.authenticated.uid")
      });
      let standup = this.get("model");
      standup.set("questionOfTheDay", newQuestionOfTheDay);
      newQuestionOfTheDay.save().then(function() {
        return standup.save();
      });
    },
    refreshQuestionOfTheDay() {
      let questionOfTheDayService = this.get("questionOfTheDay");
      let questionOfTheDayPromise = this.get("model.questionOfTheDay");
      questionOfTheDayPromise.then(record => {
        record.set(
          "question",
          questionOfTheDayService.generateRandomQuestion()
        );
        record.save();
      });
    },
    deleteQuestionOfTheDay() {
      let standup = this.get("model");
      let questionOfTheDay = standup.get("questionOfTheDay");
      questionOfTheDay.then(record => {
        record.destroyRecord().then(function() {
          return standup.save();
        });
      });
    },
    createQuestionOfTheDayAnswer(
      questionOfTheDay,
      answers,
      afterAnswer,
      value
    ) {
      let body = value === undefined ? "" : value;
      let newAnswer = this.store.createRecord("question-of-the-day-answer", {
        body: body,
        owner: this.get("session.data.authenticated.uid")
      });
      if (afterAnswer === null || afterAnswer === undefined) {
        answers.addObject(newAnswer);
      } else {
        let index = answers.indexOf(afterAnswer);
        answers.insertAt(index + 1, newAnswer);
      }
      newAnswer.save().then(function() {
        return questionOfTheDay.then(record => record.save());
      });
      this.set("isEditing", true);
    },
    deleteQuestionOfTheDayAnswer(questionOfTheDay, answer) {
      answer.destroyRecord().then(questionOfTheDay => {
        questionOfTheDay.save();
      });
    },
    onCopy() {
      this.set("showCopyStatus", true);
    },
    importTopics() {
      this.get("importTopicsTask").perform();
    },
    swapTopics(topicId, secondTopicId) {
      if (topicId === secondTopicId) {
        return;
      }
      let topics = this.get("model.topics");
      let firstTopic = topics.findBy("id", topicId);
      let secondTopic = topics.findBy("id", secondTopicId);
      let originalFirstTopicOrder = firstTopic.get("sortOrder");
      let originalSecondTopicOrder = secondTopic.get("sortOrder");
      firstTopic.set("sortOrder", originalSecondTopicOrder);
      secondTopic.set("sortOrder", originalFirstTopicOrder);
      firstTopic.save();
      secondTopic.save();
    },
    createTopic(standup) {
      let topics = this.get("model.topics");
      let highestSortNumber = Math.max(...topics.mapBy("sortOrder"));
      let sortNumber = highestSortNumber + 1;
      if (sortNumber <= 0) {
        sortNumber = topics.get("length");
      }
      let newTopic = this.store.createRecord("topic", {
        subject: "",
        owner: this.get("session.data.authenticated.uid"),
        sortOrder: sortNumber
      });
      standup.get("topics").addObject(newTopic);
      newTopic.save().then(function() {
        return standup.save();
      });
      this.logNewStandup();
    },
    deleteTopic(topic, standup) {
      topic.destroyRecord().then(function() {
        standup.save();
      });
    },
    createEntry(topic, entries, afterEntry, value) {
      let body = value === undefined ? "" : value;
      let newEntry = this.store.createRecord("entry", {
        body: body,
        owner: this.get("session.data.authenticated.uid")
      });
      if (afterEntry === null || afterEntry === undefined) {
        entries.addObject(newEntry);
      } else {
        let index = entries.indexOf(afterEntry);
        entries.insertAt(index + 1, newEntry);
      }
      newEntry.save().then(function() {
        return topic.save();
      });
      this.set("isEditing", true);
    },
    deleteEntry(topic, entry) {
      entry.destroyRecord().then(function() {
        topic.save();
      });
    },
    enableEditing() {
      this.set("isEditing", true);
    },
    disableEditing() {
      this.set("isEditing", false);
    }
  }
});
