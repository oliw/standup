import DS from 'ember-data';

export default DS.Model.extend({
  creatorId: DS.attr('string'),
  createdAt: DS.attr('date')
});
