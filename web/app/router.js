import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
    this.route("index", { path : "/" });

    this.route("users", { path: "users" });
    this.route("user", { path: "user/:username" });

    this.route("commutes", { path: "commutes" });
    this.route("commute", { path: "commute/:name" });

    this.route("statistics");
});

export default Router;
