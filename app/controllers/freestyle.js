import Ember from "ember";
import FreestyleController from "ember-freestyle/controllers/freestyle";
import EmberObject from "@ember/object";

const { inject } = Ember;

const Item = EmberObject.extend({});

export default FreestyleController.extend({
  emberFreestyle: inject.service(),

  owListItems: [
    Item.create({ name: "A" }),
    Item.create({ name: "B" }),
    Item.create({ name: "C" })
  ],

  /* BEGIN-FREESTYLE-USAGE fp--notes
### A few notes regarding freestyle-palette

- Accepts a colorPalette POJO like the one found in the freestyle.js blueprint controller
- Looks very nice

And another thing...

###### Markdown note demonstrating prettified code

```
import Ember from 'ember';

export default Ember.Component.extend({
  // ...
  colorPalette: {
    'primary': {
      'name': 'cyan',
      'base': '#00bcd4'
    },
    'accent': {
      'name': 'amber',
      'base': '#ffc107'
    }
  }
  // ...
});
```
  END-FREESTYLE-USAGE */

  colorPalette: {
    primary: {
      name: "cyan",
      base: "#00bcd4"
    },
    accent: {
      name: "amber",
      base: "#ffc107"
    },
    secondary: {
      name: "greyish",
      base: "#b6b6b6"
    },
    foreground: {
      name: "blackish",
      base: "#212121"
    },
    background: {
      name: "white",
      base: "#ffffff"
    }
  },

  actions: {
    handleValueChange(newValue) {
      alert(`This new value is ${newValue}`);
    },
    insertItem(index) {
      this.get("owListItems").insertAt(
        index,
        Item.create({ name: "New Object" })
      );
    },
    removeItem(item) {
      this.get("owListItems").removeObject(item);
    },
    insertAfter(item) {
      let index = this.get("owListItems").indexOf(item) + 1;
      this.get("owListItems").insertAt(
        index,
        Item.create({ name: "New Object" })
      );
    }
  }
});
