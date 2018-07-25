import EmberObject from '@ember/object';
import DirtiableMixinMixin from 'standup/mixins/dirtiable-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | DirtiableMixin', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let DirtiableMixinObject = EmberObject.extend(DirtiableMixinMixin);
    let subject = DirtiableMixinObject.create();
    assert.ok(subject);
  });
});
