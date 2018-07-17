import DS from 'ember-data';

export default DS.Model.extend({
  subject: DS.attr('string'),
  yesterdays: DS.hasMany('entry'),
  todays: DS.hasMany('entry'),
  blockers: DS.hasMany('entry')
});
