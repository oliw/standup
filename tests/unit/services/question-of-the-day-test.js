import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | question-of-the-day', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:question-of-the-day');
    assert.ok(service);
  });
});

