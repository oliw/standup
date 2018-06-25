import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  creatorId: DS.attr('string'),
  createdAt: DS.attr('date'),
  topics: DS.hasMany('topic')
});
