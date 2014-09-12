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

Commutes.create(ref, "test", {
        origin: "2995+Eagle+Way+%2324,+Boulder,+CO,+USA",
        destination: "4200+E+Arkansas+Ave,+Denver,+CO+80222",
        earliest_departure: "22:54",
        latest_arrival: "23:30",
        increment: 1,
        duration_threshold: 60
    })
    .then(function (test) {
        return Commutes.scheduleReadingForSingleCommuteAt(ref, test, moment().toDate());
    });
