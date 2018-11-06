import EmberRouter from "@ember/routing/router";
import config from "./config/environment";
import { inject as service } from "@ember/service";
import { scheduleOnce } from "@ember/runloop";

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
  metrics: service(),
  didTransition() {
    this._super(...arguments);
    this._trackPage();
  },
  _trackPage() {
    scheduleOnce("afterRender", this, () => {
      const page = this.get("url");
      const title = this.getWithDefault("currentRouteName", "unknown");

      this.get("metrics").trackPage({ page, title });
    });
  }
});

Router.map(function() {
  this.route("index", { path: "/" });
  this.route("about");
  this.route("pricing");
  this.route("login");
  this.route("register");
  this.route("authenticated", { path: "/a", resetNamespace: true }, function() {
    this.route("dashboard");
    this.route("standup", {
      path: "/standup/:id",
      resetNamespace: true
    });
  });
  this.route("freestyle");
});

export default Router;
