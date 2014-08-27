var _ = require("underscore");

var jsdom = require("jsdom"),
    moment = require("moment"),
    RSVP = require("rsvp");

var FirebaseRSVP = require("./firebase-rsvp");

// URL
// /readings/home-to-work/2014-08-21T06:00/{route_name|route_details|length|duration}

// FORMAT
// {
//     date: "2014-08-21T06:00",
//     day_of_the_week: 4,
//     route_name: "US 36",
//     route_details: "{}",
//     length: 49,
//     duration: 45
// }


var Readings = function (databaseRootURL) {
    this.path = "readings";
    this.uniqueKey = "date";

    // Readings methods

    this.get = function (uniqueKey) {
        return _readings.get(uniqueKey);
    };
    this.set = function (uniqueKey, options) {
        return _readings.set(uniqueKey, options);
    };
    this.update = function (uniqueKey, options) {
        return _readings.update(uniqueKey, options);
    };
    this.remove = function (uniqueKey) {
        return _readings.remove(uniqueKey);
    };

    this.buildReadingURL = function (origin, destination) {
        return [BASE_URL, origin, destination].join("/");
    };
    this.request = function (origin, destination) {
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
    };

    this.getRoute = function (window) {
        return window.jQuery(ROUTE_SELECTOR);
    };
    this.getRouteName = function (route) {
        return route.next().text().trim();
    };
    this.getRouteDuration = function (route) {
        return route.find("span").text().split(":")[1].trim();
    };
    this.parse = function (window) {
        var route = this.getRoute(window);

        return {
            route_name: this.getRouteName(route),
            duration: this.getRouteDuration(route)
        };
    };

    // Commute-related methods

    this.buildPathFromCommute = function (commute, uniqueKey) {
        return [commute.name, uniqueKey].join("/");
    };
    this.getForCommute = function (commute, uniqueKey) {
        return this.get(this.buildPathFromCommute(commute, uniqueKey));
    };
    this.setForCommute = function (commute, uniqueKey, options) {
        return this.set(this.buildPathFromCommute(commute, uniqueKey), options);
    };
    this.updateForCommute = function (commute, uniqueKey, options) {
        return this.update(this.buildPathFromCommute(commute, uniqueKey), options);
    };
    this.removeForCommute = function (commute, uniqueKey) {
        return this.remove(this.buildPathFromCommute(commute, uniqueKey));
    };
    this.createForCommute = function (commute, uniqueKey, options) {
        options = options || _.extend({}, DEFAULT_READING);
        options[this.uniqueKey] = uniqueKey;

        // Add day of the week
        options.day_of_the_week = moment(uniqueKey, DATE_FORMAT).isoWeekday();

        return this.setForCommute(commute, uniqueKey, options);
    };

    this.requestForCommute = function (commute) {
        return this.request(commute.origin, commute.destination);
    };
    this.readForCommute = function (commute) {
        var now = moment().format(DATE_FORMAT);

        return this.requestForCommute(commute)
            .then(function (window) {
                return this.parse(window);
            }.bind(this))
            .then(function (reading) {
                return this.createForCommute(commute, now, reading);
            }.bind(this));
    };

    var _readings = new FirebaseRSVP(databaseRootURL + this.path);

    var BASE_URL = "https://www.google.com/maps/dir";
    var ROUTE_SELECTOR = "#altroute_0 .dir-altroute-inner .altroute-aux";
    var DATE_FORMAT = "YYYY-MM-DDTHH:mm";

    var DEFAULT_ROUTE_NAME = "US-36 E and I-25 S";
    var DEFAULT_ROUTE_DETAILS = "{}";
    var DEFAULT_LENGTH = 49;
    var DEFAULT_DURATION = 45;
    var DEFAULT_READING = {
        route_name: DEFAULT_ROUTE_NAME,
        route_details: DEFAULT_ROUTE_DETAILS,
        length: DEFAULT_LENGTH,
        duration: DEFAULT_DURATION
    };
};

module.exports = Readings;
