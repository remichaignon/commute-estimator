import Ember from "ember";

export default Ember.Controller.extend({
    username: "jessica",

    actions: {
        start: function () {
            if (!this.get("username")) {
                throw new Error("ERROR - User invalid.");
            }

            this.transitionToRoute("users.user", this.get("username"));
        }
    }
});
