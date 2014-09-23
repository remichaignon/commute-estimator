import Ember from "ember";

export default Ember.Controller.extend({
    username: "jessica",

    actions: {
        start: function () {
            if (!this.get("username")) {
                throw new Error("ERROR - User invalid.");
            }

            this.store
                .find("user", this.get("username"))
                .then(function (user) {
                    this.transitionToRoute("user", user);
                }.bind(this));
        }
    }
});
