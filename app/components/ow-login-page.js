import Component from "@ember/component";
import { inject as service } from "@ember/service";

export default Component.extend({
  email: "",
  password: "",
  session: service(),
  store: service(),
  loggingIn: false,
  onLogin: null,
  actions: {
    login() {
      this.set("loggingIn", true);
      const session = this.get("session");
      const email = this.get("email");
      const password = this.get("password");
      const store = this.get("store");
      session
        .authenticate("authenticator:firebase", "firebase", {
          provider: "password",
          email: email,
          password: password
        })
        .then(() => {
          let data = session.data;
          let uid = data.authenticated.uid;
          store.findRecord("user", uid).then(user => {
            session.set("data.authenticated.user", user);
            this.get("onLogin")();
          });
        })
        .finally(() => {
          this.set("loggingIn", false);
        });
    }
  }
});
