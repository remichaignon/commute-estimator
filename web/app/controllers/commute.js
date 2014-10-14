import Ember from "ember";

export default Ember.ObjectController.extend({
    readOnly: Ember.computed.not("model.isNew"),

    actions: {
        save: function () {
            if (this.get("readOnly")) {
                return;
            }

            this.get("model").save();
        }
    }
});
