import Ember from "ember";

export default Ember.Controller.extend({
    actions: {
        start: function () {
            if (!this.get("username")) {
                throw new Error("ERROR - User invalid.");
            }

            this.transitionToRoute("users.user", this.get("username"));
        }
    }
});
