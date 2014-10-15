var fs = require("fs");
var moment = require("moment");

var db = {
    users: {
        fake: {
            username: "fake",
            time_to_get_ready: 30,
            commutes: {
                test: true
            }
        }
    },
    commutes: {
        test: {
            name: "test",
            origin: "2995+Eagle+Way+%2324,+Boulder,+CO,+USA",
            destination: "Denver+International+Airport,+8500+Peña+Blvd,+Denver,+CO+80249",
            earliest_departure: "06:00",
            latest_arrival: "09:00",
            increment: 10,
            duration_threshold: 60,
            user: "fake",
            readings: {}
        }
    },
    readings: {}
};

var start = moment().startOf("day").subtract(4, "weeks");

while (start.isBefore(moment())) {
    if (parseInt(start.format("HH"), 10) < 6) {
        start.add(1, "hour");
        continue;
    }
    if (parseFloat(start.format("HH.mm")) > 9) {
        start.add(1, "day").startOf("day");
        start.set("minute", 0);
        continue
    }

    var iso_datetime = start.toISOString();
    var local_datetime = start.format("YYYY-MM-DDTHH:mm");
    var local_date = start.format("YYYY-MM-DD");
    var local_time = start.format("HH:mm");

    var reading = {
        iso_datetime: iso_datetime,
        local_datetime: local_datetime,
        local_date: local_date,
        local_time: local_time,
        local_day_of_the_week: start.isoWeekday(),
        route_name: "US-36",
        route_details: "",
        length: "35",
        duration: Math.floor(40 + (Math.random() * 40)),
        commute: "test"
    };

    var id = reading.commute + "_" + local_datetime;

    db.commutes.test.readings[id] = true;
    db.readings[id] = reading;

    start.add(10, "minute");
}

fs.writeFile(
    "generated.json",
    JSON.stringify(db, null, 4),
    function (error) {
        if (error) {
            console.log("ERROR - Could not save file 'generated.json', see error below.");
            console.log(error);
        }
        else {
            console.log("SUCCESS - The file 'generated.json' was saved!");
        }
    }
);
