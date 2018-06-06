import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';

export default AdaptiveStore.extend({
  persist(data) {
    const a = data.authenticated;
    const subset = {
      authenticator: a.authenticator,
      email: a.email,
      provider: a.provider,
      refreshToken: a.refreshToken,
      uid: a.uid
    }
    return this._super({ authenticated: subset });
  }
});
