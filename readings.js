var _ = require("underscore"),
    FirebaseRSVP = require("firebase-rsvp"),
    jsdom = require("jsdom"),
    moment = require("moment"),
    RSVP = require("rsvp");

// URL
// /readings/home-to-work/2014-08-21/06:00/{route_name|route_details|length|duration}

// FORMAT
// {
//     date: "2014-08-21/06:00",
//     day_of_the_week: 4,
//     route_name: "US 36",
//     route_details: "{}",
//     length: 49,
//     duration: 45
// }

var Readings = _.extend({}, FirebaseRSVP, {
    BASE_URL: "https://www.google.com/maps/dir",
    ROUTE_SELECTOR: "#altroute_0 .dir-altroute-inner .altroute-aux",
    DATE_FORMAT: "YYYY-MM-DD/HH:mm",

    DEFAULT_ROUTE_NAME: "US-36 E and I-25 S",
    DEFAULT_ROUTE_DETAILS: "{}",
    DEFAULT_LENGTH: 49,
    DEFAULT_DURATION: 45,
    DEFAULT_READING: {
        route_name: this.DEFAULT_ROUTE_NAME,
        route_details: this.DEFAULT_ROUTE_DETAILS,
        length: this.DEFAULT_LENGTH,
        duration: this.DEFAULT_DURATION
    },

    namespace: "readings",

    // Readings methods

    create: function (ref, commuteName, uniqueKey, options) {
        options = options || _.extend({}, this.DEFAULT_READING);
        options.date = uniqueKey;

        // Add day of the week
        options.day_of_the_week = moment(uniqueKey, this.DATE_FORMAT).isoWeekday();

        return this.set(ref, [commuteName, uniqueKey], options);
    },

    // Requests methods

    buildReadingURL: function (origin, destination) {
        return [this.BASE_URL, origin, destination].join("/");
    },
    request: function (origin, destination) {
        return new RSVP.Promise(function (resolve, reject) {
            jsdom.env(
                this.buildReadingURL(origin, destination),
                ["http://code.jquery.com/jquery-1.11.1.min.js"],
                function (errors, window) {
                    if (errors) {
                        reject("Error: ", errors);
                    }
                    else {
                        resolve(window);
                    }
                }
            );
        }.bind(this));
    },

    // Parsers methods

    getRoute: function (window) {
        return window.jQuery(this.ROUTE_SELECTOR);
    },
    getRouteName: function (route) {
        return route.next().text().trim();
    },
    getRouteDuration: function (route) {
        return route.find("span").text().split(":")[1].trim();
    },
    parse: function (window) {
        var route = this.getRoute(window);

        return {
            route_name: this.getRouteName(route),
            duration: this.getRouteDuration(route)
        };
    },

    // Commute-related methods

    getForCommuteAt: function (ref, commute, time) {
        return this.get(ref, [commute.name, time]);
    },
    getForCommuteOn: function (ref, commute, date) {
        return this.get(ref, [commute.name, date]);
    },
    getAllForCommute: function (ref, commute) {
        return this.get(ref, commute.name);
    },

    requestForCommute: function (commute) {
        return this.request(commute.origin, commute.destination);
    },
    readForCommute: function (ref, commute) {
        var now = moment().format(this.DATE_FORMAT);

        return this.requestForCommute(commute)
            .then(function (window) {
                return this.parse(window);
            }.bind(this))
            .then(function (reading) {
                console.log("READ =", reading);
                // TODO: Take the create part out of here?
                return this.create(ref, commute.name, now, reading);
            }.bind(this));
    }
});

module.exports = Readings;
