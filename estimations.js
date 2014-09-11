var _ = require("underscore"),
    FirebaseRSVP = require("firebase-rsvp");

// URL
// /estimations/home-to-work/2014-08-21/06:00/{method|route_name|length|duration}

// FORMAT
// {
// 	date: "2014-08-21T06:00",
// 	method: "naive-average",
// 	route_name: "US 36",
// 	length: 49,
// 	duration: 45
// }
