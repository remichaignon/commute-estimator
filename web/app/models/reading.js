import DS from "ember-data";

export default DS.Model.extend({
    iso_datetime: DS.attr("string"),
    local_datetime: DS.attr("string"),
    local_date: DS.attr("string"),
    local_time: DS.attr("string"),
    local_day_of_the_week: DS.attr("number"),
    route_name: DS.attr("string"),
    route_details: DS.attr("string"),
    length: DS.attr("number"),
    duration: DS.attr("number"),

    commute: DS.belongsTo("commute")
});
