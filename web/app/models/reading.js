import DS from "ember-data";

export default DS.Model.extend({
    date: DS.attr("string"),
    day_of_the_week: DS.attr("number"),
    route_name: DS.attr("string"),
    route_details: DS.attr("string"),
    length: DS.attr("number"),
    duration: DS.attr("number")
});
