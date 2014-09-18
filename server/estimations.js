var _ = require("underscore"),
    FirebaseRSVP = require("firebase-rsvp"),
    moment = require("moment"),
    RSVP = require("rsvp");

var Methods = require("./methods"),
    Readings = require("./readings");

// URL
// /estimations/home-to-work/2014-08-21/06:00/naive-average/{method|route_name|length|duration}

// FORMAT
// {
//     date: "2014-08-21/06:00",
//     method: "naive-average",
//     route_name: "US 36",
//     length: 49,
//     duration: 45
// }


var Estimations = _.extend({}, FirebaseRSVP, {
    DEFAULT_ROUTE_NAME: "US-36 E and I-25 S",
    DEFAULT_ROUTE_DETAILS: "{}",
    DEFAULT_LENGTH: 49,
    DEFAULT_DURATION: 45,
    DEFAULT_METHOD: "naive-average",
    DEFAULT_ESTIMATION: {
        route_name: this.DEFAULT_ROUTE_NAME,
        route_details: this.DEFAULT_ROUTE_DETAILS,
        length: this.DEFAULT_LENGTH,
        duration: this.DEFAULT_DURATION,
        method: this.DEFAULT_METHOD
    },

    namespace: "estimations",

    // Estimation methods

    create: function (ref, commuteName, uniqueKey, options) {
        options = options || _.extend({}, this.DEFAULT_READING);
        options.date = uniqueKey;

        return this.set(ref, [commuteName, uniqueKey, options.method], options);
    },

    // Data gathering methods

    // Method-related methods
});

module.exports = Readings;
