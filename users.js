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

FirebaseRSVP.namespace = "users";

var Users = _.extend(FirebaseRSVP, {
    DEFAULT_TIME_TO_GET_READY: 30,
    DEFAULT_USER: { time_to_get_ready: this.DEFAULT_TIME_TO_GET_READY },

    uniqueKey: "username",

    // Users methods

    create: function (ref, uniqueKey, options) {
        options = options || _.extend({}, DEFAULT_USER);
        options[this.uniqueKey] = uniqueKey;

        return FirebaseRSVP.set(ref, uniqueKey, options);
    },

    // Commute-related methods

    refToCommute: function (ref, uniqueKey) {
        return ref.child([uniqueKey, "commutes"].join("/"));
    },
    refToCommutes: function (ref, uniqueKey, commute) {
        return ref.child([uniqueKey, "commutes", commute.name].join("/"));
    },
    addCommute: function (ref, uniqueKey, commute) {
        return refToCommute(ref, uniqueKey).set(commute.name, true);
    },
    getCommutes: function (ref, uniqueKey) {
        return refToCommutes()
            .then(function (commutes) {
                return Object.keys(commutes);
            });
    },
    removeCommute: function (ref, uniqueKey, commute) {
        return refToCommute(ref, uniqueKey, commute).remove();
    }
});

module.exports = Users;
