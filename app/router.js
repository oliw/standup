import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('index', {path: '/'});
  this.route('about');
  this.route('pricing');
  this.route('login');
  this.route('register');
  this.route('authenticated', { path: '/a', resetNamespace: true }, function() {
    this.route('dashboard');
    this.route('standup', {
      path: '/standup/:id',
      resetNamespace: true
    });
  });
  this.route('freestyle');
});

export default Router;
