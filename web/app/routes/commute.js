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
        var name = params.name;

        return this.store.find("commute", name)
            .catch(function () { return this.store.createRecord("commute", { id: name }); }.bind(this));
    }
});
