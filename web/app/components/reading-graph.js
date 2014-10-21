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
    paths: [],

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

        var WIDTH = this.get("width");
        var HEIGHT = this.get("height");
        var MARGINS = this.get("margin");

        var element = this.$();
        var data = this.get("readings").toArray();

        var xRange = d3.scale
            .linear()
            .range([MARGINS.left, WIDTH - MARGINS.right])
            .domain([d3.min(data, function(d) {
                return toDecimalTime(d.get("local_time"));
            }), d3.max(data, function(d) {
                return toDecimalTime(d.get("local_time"));
            })]);
        var yRange = d3.scale
            .linear()
            .range([HEIGHT - MARGINS.top, MARGINS.bottom])
            .domain([0, d3.max(data, function(d) {
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

        // element.append('svg:g')
        //     .attr('class', 'x axis')
        //     .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
        //     .call(xAxis);
        //
        // element.append('svg:g')
        //     .attr('class', 'y axis')
        //     .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
        //     .call(yAxis);

        var paths = [],
            pathIndex = -1,
            previousLocalDate = "";

        data.forEach(function (item) {
            if (item.get("local_date") !== previousLocalDate) {
                paths.push([]);
                previousLocalDate = item.get("local_date");
                pathIndex++;
            }

            paths[pathIndex].push(item);
        });

        var lineFunc = d3.svg.line()
            .x(function(d) {
                return xRange(toDecimalTime(d.get("local_time")));
            })
            .y(function(d) {
                return yRange(d.get("duration"));
            })
            .interpolate('linear');

        paths = paths.map(function (item) {
            return { path: lineFunc(item) };
        });

        this.set("paths", paths);
    },

    onDidInsertElement: function() {
        // this.set("width", this.$().width());
        // this.set("height", this.$().height());

        this.drawGraph();
    }.on("didInsertElement"),
    onReadingsChange: function () {
        this.drawGraph();
    }.observes("readings.length")
});
