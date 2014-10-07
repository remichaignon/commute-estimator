import Ember from "ember";

export default Ember.ObjectController.extend({
    readOnly: Ember.computed.not("model.isNew")
});
