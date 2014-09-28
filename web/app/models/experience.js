import DS from "ember-data";

export default DS.Model.extend({
    date: DS.attr("string"),
    route_name: DS.attr("string"),
    duration: DS.attr("number")
});
