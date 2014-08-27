var _ = require("underscore");

var FirebaseRSVP = require("./firebase-rsvp"),
    Readings = require("./readings");

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

var Commutes = function (databaseRootURL) {
    this.path = "commutes";
    this.uniqueKey = "name";

    // Commutes methods

    this.get = function (uniqueKey) {
        return _commutes.get(uniqueKey);
    };
    this.set = function (uniqueKey, options) {
        return _commutes.set(uniqueKey, options);
    };
    this.update = function (uniqueKey, options) {
        return _commutes.update(uniqueKey, options);
    };
    this.remove = function (uniqueKey) {
        return _commutes.remove(uniqueKey);
    };
    this.create = function (uniqueKey, options) {
        options = options || _.extend({}, DEFAULT_COMMUTE);
        options[this.uniqueKey] = uniqueKey;

        return this.set(uniqueKey, options);
    };

    // Reading-related methods
    this.scheduleReadings = function (uniqueKey) {
        return this.get(uniqueKey)
            .then(function (commute) {
                var earliestDeparture = commute.earliest_departure.split(":"),
                    earliestDepartureHour = parseInt(earliestDeparture[0], 10),
                    earliestDepartureMinute = parseInt(earliestDeparture[1], 10),
                    latestArrival = commute.latest_arrival.split(":"),
                    latestArrivalHour = parseInt(latestArrival[0], 10),
                    latestArrivalMinute = parseInt(latestArrival[1], 10);

                // TODO: Use earliest minute + arrival minute + increment to figure out the scheduling
                var rule = new schedule.RecurrenceRule();
                rule.dayOfWeek = [0, new schedule.Range(0, 4)];
                // rule.hour = [0, new schedule.Range(earliestDepartureHour, latestArrivalHour)];
                // rule.minute = [0, new schedule.Range(0, 50)];

                var job = schedule.scheduleJob(rule, function () {
                    _readings.readForCommute(commute);
                });
            });
    };

    var _commutes = new FirebaseRSVP(databaseRootURL + this.path);
    var _readings = new Readings(databaseRootURL);


    var DEFAULT_ORIGIN = "2995+Eagle+Way+%2324,+Boulder,+CO,+USA";
    var DEFAULT_DESTINATION = "4200+E+Arkansas+Ave,+Denver,+CO+80222";
    var DEFAULT_EARLIEST_DEPARTURE = "06:00";
    var DEFAULT_LATEST_ARRIVAL = "09:00";
    var DEFAULT_INCREMENT = 10;
    var DEFAULT_DURATION_THRESHOLD = 60;
    var DEFAULT_COMMUTE = {
        origin: DEFAULT_ORIGIN,
        destination: DEFAULT_DESTINATION,
        earliest_departure: DEFAULT_EARLIEST_DEPARTURE,
        latest_arrival: DEFAULT_LATEST_ARRIVAL,
        increment: DEFAULT_INCREMENT,
        duration_threshold: DEFAULT_DURATION_THRESHOLD
    };
};

module.exports = Commutes;
