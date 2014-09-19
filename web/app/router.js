import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
    this.resource("index", { path: "/" });

    this.resource("user", { path: ":username" });
});

export default Router;
