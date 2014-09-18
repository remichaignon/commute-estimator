var _ = require("underscore"),
    FirebaseRSVP = require("firebase-rsvp"),
    moment = require("moment"),
    RSVP = require("rsvp");

var Estimations = require("./estimations"),
    Methods = require("./methods"),
    Readings = require("./readings");

// URL
// /analytics/naive-average/2014-08-21/06:00/{read|estimated|experienced}

// FORMAT
// {
//     read: 42,
//     estimated: 42,
//     experienced: 42
// }


var Analytics = _.extend({}, FirebaseRSVP, {
    DEFAULT_READ: 42,
    DEFAULT_ESTIMATED: 42,
    DEFAULT_EXPERIENCED: 42,
    DEFAULT_ANALYTIC: {
        read: this.DEFAULT_READ,
        estimated: this.DEFAULT_ESTIMATED,
        experienced: this.DEFAULT_EXPERIENCED
    },

    namespace: "analytics",

    // Analytics methods

    create: function (ref, methodName, uniqueKey, options) {
        options = options || _.extend({}, this.DEFAULT_ANALYTIC);
        options.date = uniqueKey;

        return this.set(ref, [methodName, uniqueKey], options);
    },

    // Data gathering methods

    // Rollups methods
});

module.exports = Readings;
