import DS from "ember-data";

export default DS.Model.extend({
    name: DS.attr("string"),
    origin: DS.attr("string"),
    destination: DS.attr("string"),
    earliest_departure: DS.attr("string"),
    latest_arrival: DS.attr("string"),
    increment: DS.attr("number"),
    duration_threshold: DS.attr("number")
});
