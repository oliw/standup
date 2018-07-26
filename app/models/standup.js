import DS from 'ember-data';
import DirtiableMixin from 'standup/mixins/dirtiable-mixin';

export default DS.Model.extend(DirtiableMixin, {
  title: DS.attr('string'),
  date: DS.attr('local-date'),
  creatorId: DS.attr('string'),
  createdAt: DS.attr('date'),
  topics: DS.hasMany('topic')
});
