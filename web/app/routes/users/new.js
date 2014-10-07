import Ember from "ember";

export default Ember.Route.extend({
    model: function (params) {
        return this.store.createRecord("user");
    },
    renderTemplate: function (controller, model) {
        this.render("users.user", { controller: "users.user", model: model });
    }
});
