import DS from "ember-data";

export default DS.Model.extend({
    origin: DS.attr("string"),
    destination: DS.attr("string"),
    earliest_departure: DS.attr("string"),
    latest_arrival: DS.attr("string"),
    increment: DS.attr("number"),
    duration_threshold: DS.attr("number"),
    created_at: DS.attr("date"),

    user: DS.belongsTo("user", { async: true }),
    readings: DS.hasMany("reading", { async: true })
});
