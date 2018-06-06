import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  email: '',
  password: '',
  session: service(),
  actions: {
    login() {
      const session = this.get('session');
      const email = this.get('email');
      const password = this.get('password');
      session.authenticate('authenticator:firebase', 'firebase', {
        provider: 'password',
        email: email,
        password: password
      });
    }
  }
});
