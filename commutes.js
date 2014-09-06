var _ = require("underscore"),
    FirebaseRSVP = require("firebase-rsvp"),
    RSVP = require("rsvp"),
    schedule = require("node-schedule");

var Readings = require("./readings");

// URL
// /commutes/home-to-work/{earliest_departure|latest_arrival|increment|duration_threshold}

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
    uniqueKey: "name",

    // Commutes methods

    create: function (ref, uniqueKey, options) {
        options = options || _.extend({}, this.DEFAULT_COMMUTE);
        options[this.uniqueKey] = uniqueKey;

        return this.set(ref, uniqueKey, options);
    },

    // Reading-related methods

    getEarliestDepartureForToday: function (earliestDepartureTime) {
        return moment(earliestDepartureTime, "HH:mm");
    },
    getLatestArrivalForToday: function (latestArrivalTime) {
        return moment(latestArrivalTime, "HH:mm");
    },

    scheduleTodaysReadingsForSingleCommute: function (ref, uniqueKey) {
        return this.get(ref, uniqueKey)
            .then(function (commute) {
                var scheduledTime = this.getEarliestDepartureForToday(commute.earliest_departure),
                    latestArrival = this.getLatestArrivalForToday(commute.latest_arrival),
                    increment = commute.increment;

                while (scheduledTime.isBefore(latestArrival)) {
                    console.log(scheduledTime.toISOString());
                    schedule.scheduleJob(scheduledTime.toDate(), function () {
                        console.log("READING ESTIMATE @ " + (new Date()).getTime());
                    });

                    scheduledTime.add("minute", increment);
                }
            }.bind(this));
    },
    scheduleTodaysReadingsForAllCommutes: function (ref) {
        var requests = [];

        return this.get(ref)
            .then(function (commutes) {
                commutes.forEach(function (commute) {
                    requests.push(this.scheduleTodaysReadingsForSingleCommute(ref, commute[this.uniqueKey]));
                }.bind(this));

                return RSVP.all(requests);
            }.bind(this));
    }
});

module.exports = Commutes;
