import Ember from "ember";

export default Ember.ObjectController.extend({
    newCommuteName: "",
    readOnly: Ember.computed.not("model.isNew"),

    actions: {
        save: function () {
            if (this.get("readOnly")) {
                return;
            }

            this.get("model").save();
        },
        addCommute: function () {
            var newCommute = this.store.createRecord("commute", { id: this.get("newCommuteName"), user: this.get("model") });

            this.transitionToRoute("commute", newCommute);
        }
    }
});
