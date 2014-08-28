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

var Users = function (databaseRootURL) {
    this.path = "users";
    this.uniqueKey = "username";

    // Users methods

    this.get = function (uniqueKey) {
        return _users.get(uniqueKey);
    };
    this.set = function (uniqueKey, options) {
        return _users.set(uniqueKey, options);
    };
    this.update = function (uniqueKey, options) {
        return _users.update(uniqueKey, options);
    };
    this.remove = function (uniqueKey) {
        return _users.remove(uniqueKey);
    };
    this.create = function (uniqueKey, options) {
        options = options || _.extend({}, DEFAULT_USER);
        options[this.uniqueKey] = uniqueKey;

        return this.set(uniqueKey, options);
    };

    // Commute-related methods

    this.buildPathForCommute = function (uniqueKey, commute) {
        return [uniqueKey, "commutes", commute.name].join("/");
    };
    this.addCommute = function (uniqueKey, commute) {
        return this.set(this.buildPathForCommute(uniqueKey, commute), true);
    };
    this.getCommutes = function (uniqueKey) {
        return this.get(uniqueKey + "/commutes")
            .then(function (commutes) {
                return Object.keys(commutes);
            });
    };
    this.removeCommute = function (uniqueKey, commute) {
        return this.remove(this.buildPathForCommute(uniqueKey, commute));
    };

    var _users = new FirebaseRSVP(databaseRootURL + this.path);

    var DEFAULT_TIME_TO_GET_READY = 30;
    var DEFAULT_USER = { time_to_get_ready: DEFAULT_TIME_TO_GET_READY };
};

module.exports = Users;
