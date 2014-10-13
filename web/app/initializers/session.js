import Ember from "ember";

export default {
    name: "session",

    initialize: function (container, application) {
        application.register(
            "session:main",
            Ember.Object.extend({
                user: null
            })
        );
        application.inject("controller", "session", "session:main");
    }
};
