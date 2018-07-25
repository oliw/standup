import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { on } from '@ember/object/evented';
import { defineProperty } from '@ember/object';

export default Mixin.create({
  initDirtyProperties: on('ready', function() {
    let model = this;
    const relationsObserver = [];
    relationsObserver.push('hasDirtyAttributes');
    model.eachRelationship((name, descriptor) => {
      if (descriptor.kind  == 'hasMany') {
        // TODO Make sure this works when async is false
        relationsObserver.push(descriptor.key+'.content.@each.hasDirtyAttributesAndRelationships');
        relationsObserver.push(descriptor.key+'.isFulfilled');
      } else {
        // TODO verify this works for belongsTo
        relationsObserver.push(descriptor.key+'.hasDirtyAttributesAndRelationships');
      }
    });

    const hasDirtyAttributesAndRelationships = function() {
      let result = false;
      let model = this;
      result = result || model.get('hasDirtyAttributes');
      model.eachRelationship((name, descriptor) => {
        if (descriptor.kind == 'hasMany') {
          let ref = model.hasMany(name);
          let isLoaded = ref.value() !== null;
          if (isLoaded) {
            let models = ref.value();
            models.forEach(child => {
              result = result || child.get('hasDirtyAttributesAndRelationships');
            });
          }
        } else { // belongs to
          let ref = model.belongsTo(name);
          let isLoaded = ref.value() !== null;
          if (isLoaded) {
            let child = ref.value();
            result = result || child.get('hasDirtyAttributesAndRelationships');
          }
        }
      });
      return result;
    };

    let computedArgs = relationsObserver.concat([hasDirtyAttributesAndRelationships]);
    defineProperty(model, 'hasDirtyAttributesAndRelationships', computed(...computedArgs));
  })
});
