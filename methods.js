var _ = require("underscore"),
    FirebaseRSVP = require("firebase-rsvp");

// URL
// /methods/naive-average/{name|description}

// FORMAT
// {
// 	name: "naive-average",
// 	description: "Take all the data points from the same day of the week and same hour and average them"
// }
