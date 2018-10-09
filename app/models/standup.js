import DS from 'ember-data';
import { equal, gt } from '@ember/object/computed';
import { computed } from '@ember/object';

export default DS.Model.extend({
  title: DS.attr('string'),
  date: DS.attr('local-date'),
  creatorId: DS.attr('string'),
  createdAt: DS.attr('date'),
  owner: DS.attr('string'),
  topics: DS.hasMany('topic', { async: true, inverse: null }),
  hasNoTopics: equal('topics.length', 0),
  hasSomeTopics: gt('topics.length', 0),
  questionOfTheDay: DS.belongsTo('question-of-the-day', { async: true, inverse: null }),

  allEntries: computed('topics.@each.allEntries', function() {
    return this.get('topics').reduce(function(acc, topic) {
      return acc.concat(topic.get('allEntries'));
    }, []);
  })
});
