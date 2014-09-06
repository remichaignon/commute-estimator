var _ = require("underscore"),
    FirebaseRSVP = require("firebase-rsvp");

// URL
// /users/jessica/{commutes|time_to_get_ready}

// FORMAT
// {
//     username: "jessica",
//     time_to_get_ready: 30,
//     commutes: {}
// }

var Users = _.extend({}, FirebaseRSVP, {
    DEFAULT_TIME_TO_GET_READY: 30,
    DEFAULT_USER: { time_to_get_ready: this.DEFAULT_TIME_TO_GET_READY },

    namespace: "users",
    uniqueKey: "username",

    // Users methods

    create: function (ref, uniqueKey, options) {
        options = options || _.extend({}, this.DEFAULT_USER);
        options[this.uniqueKey] = uniqueKey;

        return this.set(ref, uniqueKey, options);
    },

    // Commute-related methods

    getPathToAllCommutes: function (uniqueKey) {
        return [uniqueKey, "commutes"];
    },
    getPathToSingleCommute: function (uniqueKey, commute) {
        return this.getPathToAllCommutes(uniqueKey).push(commute.name);
    },
    getCommutes: function (ref, uniqueKey) {
        return this.get(ref, this.getPathToAllCommutes(uniqueKey))
            .then(function (commutes) {
                return Object.keys(commutes);
            });
    },
    addCommute: function (ref, uniqueKey, commute) {
        var pathToCommuteToAdd = this.getPathToSingleCommute(uniqueKey, commute);
        return this.set(pathToCommuteToAdd, true);
    },
    removeCommute: function (ref, uniqueKey, commute) {
        var pathToCommuteToRemove = this.getPathToSingleCommute(uniqueKey, commute);
        return this.remove(ref, pathToCommuteToRemove).remove();
    }
});

module.exports = Users;
