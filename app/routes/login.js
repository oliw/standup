import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    goToStart() {
      this.transitionTo('authenticated.start');
    }
  }
});
