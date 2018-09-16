import DS from 'ember-data';
import { notEmpty, union } from '@ember/object/computed';

export default DS.Model.extend({
  subject: DS.attr('string'),
  yesterdays: DS.hasMany('entry', { async: true, inverse: null}),
  todays: DS.hasMany('entry', { async: true, inverse: null }),
  blockers: DS.hasMany('entry', { async: true, inverse: null }),
  owner: DS.attr('string'),

  hasSubject: notEmpty('subject'),
  allEntries: union('todays', 'yesterdays', 'blockers')
});
