import Ember from "ember";

export default Ember.Route.extend({
    actions: {
        willTransition: function () {
            if (this.get("controller.model.isNew")) {
                this.get("controller.model").deleteRecord();
            }
        }
    },

    model: function (params) {
        var username = params.username;

        return this.store.find("user", username)
            .catch(function () { return this.store.createRecord("user", { id: username }); }.bind(this));
    }
});
