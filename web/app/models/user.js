import DS from "ember-data";

export default DS.Model.extend({
    username: DS.attr("string"),
    time_to_get_ready: DS.attr("number")
});