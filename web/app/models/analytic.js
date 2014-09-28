import DS from "ember-data";

export default DS.Model.extend({
    read: DS.attr("number"),
    estimated: DS.attr("number"),
    experienced: DS.attr("number")
});
