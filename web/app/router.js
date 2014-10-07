import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
    this.resource("index", { path : "/" });

    this.resource("users", { path: "users" }, function () {
        this.route("new");
        this.route("user", { path: ":username" });
    });

    this.resource("commutes", { path: "commutes" }, function () {
        this.route("new");
        this.route("commute", { path: ":name" });
    });

    this.resource("methods");
    this.resource("statistics");
});

export default Router;
