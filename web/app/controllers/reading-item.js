import Ember from "ember";

export default Ember.ObjectController.extend({
    weekdays: [null, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],

    localDayOfTheWeek: function () {
        return this.get("weekdays")[this.get("local_day_of_the_week")];
    }.property("local_day_of_the_week")
});
