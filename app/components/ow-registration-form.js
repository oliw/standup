import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  email: "",
  password: "",
  firebase: service("firebaseApp"),
  store: service(),
  actions: {
    register() {
      let firebase = this.get('firebase');
      let authService = firebase.auth();
      let email = this.get('email');
      let password = this.get('password');
      authService.createUserWithEmailAndPassword(email, password).then((response) => {
        let user = this.get('store').createRecord('user', {
          id: response.uid,
          email: response.email
        });
        user.save();
      });
    }
  }
});
