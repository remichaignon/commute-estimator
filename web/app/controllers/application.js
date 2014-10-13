import Ember from "ember";

export default Ember.Controller.extend({
    username: "",

    actions: {
        start: function () {
            var username = this.get("username");

            if (!username) {
                throw new Error("ERROR - User invalid.");
            }

            this.get("session").set("user", username)
            this.transitionToRoute("user", username);
        },
        stop: function () {
            this.set("username", "")
            this.get("session").set("user", "");
            this.transitionToRoute("index");
        }
    }
});
