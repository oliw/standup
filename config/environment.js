'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'standup',
    environment,
    rootURL: '/',
    locationType: 'auto',
    torii: {},
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    metricsAdapters: [{
      name: 'GoogleAnalytics',
      environments: ['development', 'production'],
      config: {
        id: 'UA-44803962-2',
        debug: environment === 'development',
        trace: environment === 'development',
         sendHitTask: environment !== 'development'
      }
    }],
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.firebase = {
      apiKey: 'AIzaSyCSzusoKp0ynbA6MxIQt9KYqf5V2HERls8',
      authDomain: 'standup-development.firebaseapp.com',
      databaseURL: 'https://standup-development.firebaseio.com',
      storageBucket: 'standup-development.appspot.com'
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV.firebase = {
      apiKey: "AIzaSyBIJyGRJJMx1IBK8TS8ZbNipgKQRXfT__E",
      authDomain: "standup-production-32c4b.firebaseapp.com",
      databaseURL: "https://standup-production-32c4b.firebaseio.com",
      projectId: "standup-production-32c4b",
      storageBucket: "standup-production-32c4b.appspot.com",
      messagingSenderId: "127732344377"
    };
  }

  return ENV;
};
