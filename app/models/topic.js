import DS from 'ember-data';
import DirtiableMixin from 'standup/mixins/dirtiable-mixin';

export default DS.Model.extend(DirtiableMixin, {
  subject: DS.attr('string'),
  yesterdays: DS.hasMany('entry'),
  todays: DS.hasMany('entry'),
  blockers: DS.hasMany('entry')
});
