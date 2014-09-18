var jsdom = require("jsdom"),
    Firebase = require("firebase"),
    fs = require("fs"),
    moment = require("moment"),
    RSVP = require("rsvp"),
    schedule = require("node-schedule");

var Commutes = require("./commutes"),
    // Estimations = require("./estimations"),
    // Experiences = require("./experiences"),
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

var ref = new Firebase(DB_ROOT_URL);

// Users.get(ref, "jessica")
//     .then(function (jessica) {
//         console.log(jessica);
//     });
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

Commutes.get(ref, "test")
    .then(function (test) {
        return Commutes.scheduleReadingForSingleCommuteAt(ref, test, moment().toDate());
    });

// EVERY DAY  - 1 AM

// Schedule mornings
// Schedule evenings

// MORNINGS - 12 PM (NOON)

// Schedule mornings commutes readings
// (Schedule mornings commutes experiences acquisitions)
// Schedule mornings commutes estimations
// Schedule mornings commutes analytics

// EVENINGS - 12 AM (MIDNIGHT)

// Schedule evenings commutes readings
// (Schedule evenings commutes experiences acquisitions)
// Schedule evenings commutes estimations
// Schedule evenings commutes analytics
