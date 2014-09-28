import DS from "ember-data";

export default DS.Model.extend({
    date: DS.attr("string"),
    method: DS.belongsTo("method"),
    route_name: DS.attr("string"),
    length: DS.attr("number"),
    duration: DS.attr("number")
});
