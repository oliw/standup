import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias, not } from '@ember/object/computed';

export default Component.extend({
  session: service(),
  loggedIn: alias('session.isAuthenticated'),
  guest: not('loggedIn'),
  actions: {
    logout() {
      this.get('session').invalidate();
    }
  }
});
