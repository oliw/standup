import DS from 'ember-data';
import DirtiableMixin from 'standup/mixins/dirtiable-mixin';
import { notEmpty } from '@ember/object/computed';

export default DS.Model.extend(DirtiableMixin, {
  subject: DS.attr('string'),
  yesterdays: DS.hasMany('entry'),
  todays: DS.hasMany('entry'),
  blockers: DS.hasMany('entry'),

  hasSubject: notEmpty('subject')
});
