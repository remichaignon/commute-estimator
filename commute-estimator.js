var jsdom = require("jsdom"),
    fs = require("fs"),
    moment = require("moment")
    RSVP = require("rsvp"),
    schedule = require("node-schedule");

var Commutes = require("./commutes"),
    // Estimations = require("./estimations"),
    // Experiments = require("./experiments"),
    Readings = require("./readings"),
    Users = require("./users");

function buildErrorMessage (error) {
    if (!error) return "unknown";

    return error.code;
};
function logError (error) {
    console.log("ERROR - ", buildErrorMessage(error));
};

var DB_ROOT_URL = "https://commute-estimator.firebaseio.com/";

var users = new Users(DB_ROOT_URL),
    commutes = new Commutes(DB_ROOT_URL),
    readings = new Readings(DB_ROOT_URL);//,
    // estimations = new Estimations(DB_ROOT_URL),
    // experiments = new Experiments(DB_ROOT_URL);

users.get("jessica")
    .then(function (jessica) {
        console.log(jessica);
        return users.getCommutes(jessica.username);
    })
    .then(function (jessicaCommutes) {
        return commutes.get(jessicaCommutes[0]);
    })
    .then(function (commute) {
        return commutes.scheduleReadings(commute.name)
    });
