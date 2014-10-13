import Ember from "ember";

export default Ember.Route.extend({
    model: function (params) {
        var username = params.username;

        return this.store.find("user", username)
            .catch(function () { return this.store.createRecord("user", { id: username, username: username }); }.bind(this));
    }
});
