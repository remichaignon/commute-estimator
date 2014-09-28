import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
    this.resource("index", { path: "/" });

    this.resource("users");
    this.resource("user", { path: ":username" });

    this.resource("commutes", { path: "commutes/:name" });

    this.resource("readings");
    this.resource("experiences");

    this.resource("methods");
    this.resource("analytics");

    this.resource("estimations");
});

export default Router;
