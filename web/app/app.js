import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;


// Generate readings
// var db = {
//     users: {
//         fake: {
//             username: "fake",
//             time_to_get_ready: 30,
//             commutes: {
//                 test: true
//             }
//         }
//     },
//     commutes: {
//         test: {
//             name: "test",
//             origin: "2995+Eagle+Way+%2324,+Boulder,+CO,+USA",
//             destination: "Denver+International+Airport,+8500+Peña+Blvd,+Denver,+CO+80249",
//             earliest_departure: "06:00",
//             latest_arrival: "09:00",
//             increment: 10,
//             duration_threshold: 60
//         }
//     },
//     readings: {}
// };
// var start = moment().startOf("day").subtract("weeks", 4);
//
// while (start.isBefore(moment())) {
//     if (parseInt(start.format("HH"), 10) < 6) {
//         start.add("hour", 1);
//         continue;
//     }
//     if (parseInt(start.format("HH"), 10) > 9) {
//         start.add("day", 1).startOf("day");
//         continue
//     }
//
//     var date = start.format("YYYY-MM-DD");
//     var time = start.format("HH:mm");
//
//     var reading = {
//         date: start.toISOString(),
//         day_of_the_week: start.isoWeekday(),
//         route_name: "",
//         route_details: "",
//         length: "35",
//         duration: Math.floor(40 + (Math.random() * 40))
//     };
//
//     db.readings[date] = a.readings[date] || {};
//     db.readings[date][time] = reading;
//
//     start.add("minute", 10);
// }
