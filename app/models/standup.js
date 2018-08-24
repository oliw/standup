import DS from 'ember-data';
import DirtiableMixin from 'standup/mixins/dirtiable-mixin';
import { equal, gt } from '@ember/object/computed';

export default DS.Model.extend(DirtiableMixin, {
  title: DS.attr('string'),
  date: DS.attr('local-date'),
  creatorId: DS.attr('string'),
  createdAt: DS.attr('date'),
  owner: DS.attr('string'),
  topics: DS.hasMany('topic'),
  hasNoTopics: equal('topics.length', 0),
  hasSomeTopics: gt('topics.length', 0),
  hasSomeTopics: true
});
