var _ = require("underscore"),
    FirebaseRSVP = require("firebase-rsvp");

// URL
// /experiments/home-to-work/2014-08-21T06:00/{duration|route_name?}

// FORMAT
// {
// 	date: "2014-08-21T06:00",
// 	route_name: "US 36",
// 	duration: 45
// }

// TODO: Integrate with the Automatic API
