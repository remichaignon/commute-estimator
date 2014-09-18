var _ = require("underscore"),
    FirebaseRSVP = require("firebase-rsvp"),
    moment = require("moment"),
    RSVP = require("rsvp");

// URL
// /methods/naive-average/{name|description}

// FORMAT
// {
//     name: "naive-average",
//     description: "Take all the data points from the same day of the week and same hour and average them"
// }

var Methods = _.extend({}, FirebaseRSVP, {
    DEFAULT_NAME: "random",
    DEFAULT_DESCRIPTION: "This is a description",
    DEFAULT_METHOD: {
        name: this.DEFAULT_NAME,
        description: this.DEFAULT_DESCRIPTION
    },

    namespace: "methods",

    // Readings methods

    create: function (ref, uniqueKey, options) {
        options = options || _.extend({}, this.DEFAULT_METHOD);
        options.name = uniqueKey;

        return this.set(ref, uniqueKey, options);
    },

    // Calculation methods

    calculateFromPastFourWeeksDataWithNaiveAverageMethod: function (now, data) {},

    calculateFromPastFourWeeksDataWithWeightedAverageMethod: function (now, data) {},

    calculateFromPastFourWeeksDataWithMethod: function (now, data, method) {
        switch (method) {
            case "naive-average":
                this.calculateFromPastFourWeeksDataWithNaiveAverageMethod(data);
                break;
            case "weighted-average":
                this.calculateFromPastFourWeeksDataWithWeightedAverage(data);
                break;
            default:
                throw new Error("ERROR - Method unknown.");
                break;
        }
    }
});

module.exports = Readings;
