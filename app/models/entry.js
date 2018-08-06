import DS from 'ember-data';
import DirtiableMixin from 'standup/mixins/dirtiable-mixin';

export default DS.Model.extend(DirtiableMixin, {
  body: DS.attr('string'),
  owner: DS.attr('string')
});
