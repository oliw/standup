import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { LocalDate, ZoneId } from 'js-joda';

export default Route.extend({
  store: service(),

  dayOfWeek: (function() {
    const d = new Date();
    const weekday = new Array(7);
    weekday[0] =  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    return weekday[d.getDay()];
  }).property(),

  model(params) {
    let date = LocalDate.now(ZoneId.SYSTEM);
    let dayOfWeek = this.get('dayOfWeek');
    let standup = this.get('store').createRecord('standup', {
      title: dayOfWeek,
      date: date
    });
    return standup;
  }
});
