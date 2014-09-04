var jsdom = require("jsdom"),
    Firebase = require("firebase"),
    fs = require("fs"),
    moment = require("moment"),
    RSVP = require("rsvp"),
    schedule = require("node-schedule");

var Commutes = require("./commutes"),
    // Estimations = require("./estimations"),
    // Experiments = require("./experiments"),
    Readings = require("./readings"),
    Users = require("./users");


// UTILS

function buildErrorMessage (error) {
    if (!error) return "unknown";

    return error.code;
};
function logError (error) {
    console.log("ERROR - ", buildErrorMessage(error));
};


// VARIABLES

var DB_ROOT_URL = "https://commute-estimator.firebaseio.com/";


// START

var firebaseRef = new Firebase(DB_ROOT_URL);

Users.get(firebaseRef, "jessica")
    .then(function (jessica) {
        console.log(jessica);
    });
    // .then(function (jessica) {
    //     console.log(jessica);
    //     return users.getCommutes(jessica.username);
    // })
    // .then(function (jessicaCommutes) {
    //     return commutes.get(jessicaCommutes[0]);
    // })
    // .then(function (commute) {
    //     return commutes.scheduleReadings(commute.name)
    // });
