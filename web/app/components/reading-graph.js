import Ember from "ember";

var toDecimalTime = function (timeString) {
    var timeArray = timeString.split(":"),
        hours = parseInt(timeArray[0], 10) * 100,
        minutes = parseInt(timeArray[1], 10) * 100 / 60,
        decimalTime = hours + minutes;

    return decimalTime;
};

export default Ember.Component.extend({
    tagName: 'svg',

    readings: null,

    width:  900,
    height: 300,

    margin: {
        top:    10,
        right:  10,
        bottom: 40,
        left:   40
    },

    drawGraph: function () {
        if (!this.get("readings.length")) {
            return;
        }

        var width = this.get("width"),
            height = this.get("height"),
            margins = this.get("margin"),
            readings = this.get("readings").toArray();

        var xRange = d3.scale
            .linear()
            .range([margins.left, width - margins.right])
            .domain([d3.min(readings, function (d) {
                return toDecimalTime(d.get("local_time"));
            }), d3.max(readings, function (d) {
                return toDecimalTime(d.get("local_time"));
            })]);
        var yRange = d3.scale
            .linear()
            .range([height - margins.top, margins.bottom])
            .domain([0, d3.max(readings, function (d) {
                return d.get("duration");
            })]);
        var xAxis = d3.svg.axis()
            .scale(xRange)
            .tickSize(5)
            .tickSubdivide(true);
        var yAxis = d3.svg.axis()
            .scale(yRange)
            .tickSize(5)
            .orient('left')
            .tickSubdivide(true);

        d3.select(this.$()[0])
            .append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + (height - margins.bottom) + ')')
            .call(xAxis);

        d3.select(this.$()[0])
            .append('svg:g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + (margins.left) + ',0)')
            .call(yAxis);

        var readingsByDay = d3.nest()
            .key(function (d) {
                return d.get("local_date");
            })
            .map(readings, d3.map)
            .values();

        var meanByTime = d3.nest()
            .key(function (d) {
                return d.get("local_time");
            })
            .rollup(function (d) {
                return d3.mean(d, function (a) {
                    return a.get("duration");
                });
            })
            .map(readings, d3.map);

        meanByTime.forEach(function (key, value) {
            this.set(key, Ember.Object.create({
                local_time: key,
                duration: value
            }));
        });

        meanByTime = meanByTime.values();

        var lineFunc = d3.svg.line()
            .x(function (d) {
                return xRange(toDecimalTime(d.get("local_time")));
            })
            .y(function (d) {
                return yRange(d.get("duration"));
            })
            .interpolate("linear");

        var svg = d3
            .select(this.$()[0])
            .style("width", width)
            .style("height", height);

        var reading = svg
            .selectAll(".reading")
            .data(readingsByDay)
            .enter()
            .append("g")
            .attr("class", "reading");

        reading.append("path")
            .attr("class", "line")
            .attr("d", function (d) { return lineFunc(d); })
            .style("stroke", "blue");

        var average = svg
            .append("path")
            .datum(meanByTime)
            .attr("class", "line")
            .attr("d", function (d) { return lineFunc(d); })
            .style("stroke", "red");
    },

    onReadingsChange: function () {
        this.drawGraph();
    }.observes("readings.length").on("didInsertElement")
});
