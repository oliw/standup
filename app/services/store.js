import DS from 'ember-data';
import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';


export default DS.Store.extend({
  session: service(),
  loggedIn: alias('session.isAuthenticated'),
  adapterFor(modelName) {
    let owner = getOwner(this);
    let persistenceLayer = '';
    if (this.get('loggedIn')) {
      return owner.lookup('adapter:firebase');
    } else {
      return owner.lookup('adapter:localstorage');
    }
  }
});
