var _ = require("underscore"),
    FirebaseRSVP = require("firebase-rsvp"),
    schedule = require("node-schedule");

var Readings = require("./readings");

// URL
// /commutes/home-to-work/{earliest_departure|latest_arrival|increment|duration_threshold}
// >>> Add owner's username to commute's name to make it unique?

// FORMAT
// {
//     name: "home-to-work",
//     origin: "2995+Eagle+Way+%2324,+Boulder,+CO,+USA",
//     destination: "4200+E+Arkansas+Ave,+Denver,+CO+80222",
//     earliest_departure: "06:00",
//     latest_arrival: "09:00",
//     increment: 10,
//     duration_threshold: 60
// }

var Commutes = _.extend({}, FirebaseRSVP, {
    DEFAULT_ORIGIN: "2995+Eagle+Way+%2324,+Boulder,+CO,+USA",
    DEFAULT_DESTINATION: "4200+E+Arkansas+Ave,+Denver,+CO+80222",
    DEFAULT_EARLIEST_DEPARTURE: "06:00",
    DEFAULT_LATEST_ARRIVAL: "09:00",
    DEFAULT_INCREMENT: 10,
    DEFAULT_DURATION_THRESHOLD: 60,
    DEFAULT_COMMUTE: {
        origin: this.DEFAULT_ORIGIN,
        destination: this.DEFAULT_DESTINATION,
        earliest_departure: this.DEFAULT_EARLIEST_DEPARTURE,
        latest_arrival: this.DEFAULT_LATEST_ARRIVAL,
        increment: this.DEFAULT_INCREMENT,
        duration_threshold: this.DEFAULT_DURATION_THRESHOLD
    },

    namespace: "commutes",

    // Commutes methods

    create: function (ref, uniqueKey, options) {
        options = options || _.extend({}, this.DEFAULT_COMMUTE);
        options.name = uniqueKey;

        return this.set(ref, uniqueKey, options);
    },

    // Reading-related methods

    getEarliestDepartureForToday: function (earliestDepartureTime) {
        return moment(earliestDepartureTime, "HH:mm");
    },
    getLatestArrivalForToday: function (latestArrivalTime) {
        return moment(latestArrivalTime, "HH:mm");
    },

    scheduleReadingForSingleCommuteAt: function (ref, commute, date) {
        console.log("SCHEDULING @", date.toISOString());

        // schedule.scheduleJob(date, function () {
        //     console.log("READING ESTIMATE @ " + (new Date()).getTime());
        // });

        // The above solution fails for some reason
        // The below solution is a hack to replace it

        var rule = new schedule.RecurrenceRule();

        var j = schedule.scheduleJob(rule, function(){
            console.log("READING @", (new Date()).toISOString());
            Readings.readForCommute(ref, commute);
            j.cancel();
        });
    },
    scheduleTodaysReadingsForSingleCommute: function (ref, commute) {
        var scheduledTime = this.getEarliestDepartureForToday(commute.earliest_departure),
            latestArrival = this.getLatestArrivalForToday(commute.latest_arrival),
            increment = commute.increment;

        while (scheduledTime.isBefore(latestArrival)) {
            this.scheduleReadingForSingleCommuteAt(ref, commute, scheduledTime.toDate());

            scheduledTime.add("minute", increment);
        }
    },
    scheduleTodaysReadingsForAllCommutes: function (ref) {
        return this.get(ref)
            .then(function (commutes) {
                commutes.forEach(function (commute) {
                    this.scheduleTodaysReadingsForSingleCommute(ref, commute);
                }.bind(this));
            }.bind(this));
    }
});

module.exports = Commutes;
