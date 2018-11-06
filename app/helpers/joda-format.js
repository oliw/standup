import MomentFormat from "ember-moment/helpers/moment-format";
import { LocalDate } from "js-joda";

export default MomentFormat.extend({
  compute: function([datetime, ...rest], hash) {
    let momentCompatibleDateTime = datetime;
    if (datetime instanceof LocalDate) {
      momentCompatibleDateTime = datetime.toString();
    }
    return this._super([momentCompatibleDateTime].concat(rest), hash);
  }
});
