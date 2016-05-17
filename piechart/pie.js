/* ------- ANONYMOUS FUNCTIONS -------*/
//TODO: need to put all these anonymous functions in a helper library
var key = function(d){ return d.data.label; };

//anonymous function
var objKey = function(d, i) {return Object.keys(d)[i]};
var objVal = function(d, i) {return d[objKey(d,i)];}

var tags = function(data) {return _.unique(data.map(function(d){return objVal(d,0)}));};
var media = function(data) {return _.unique(data.map(function(d){return objVal(d,1)}));};
var values = function(data) {return data.map(function(d){return objVal(d,2)});};


//PieChart Constructor
var PieChart = function(divId, data) {

  /* ------- CONSTANTS -------*/
  const MARGIN = { top: 80, right: 0, bottom: 100, left: 100 },
        PADDING = 2,
        WIDTH = 700 - MARGIN.left - MARGIN.right,
        HEIGHT = 400,
  	    RADIUS = Math.min(WIDTH, HEIGHT) / 2;
  const duration = 1000;
  //pieChart(bindData(data), divId, width, height);

  var pie = d3.layout.pie()
  	.sort(null)
  	.value(function(d) {
  		return d.value;
  	});

  var arc = d3.svg.arc()
  	.outerRadius(RADIUS * 0.8)
  	.innerRadius(RADIUS * 0.4);

  var arcInner = d3.svg.arc()
  	.outerRadius(RADIUS * 0.3);


  var outerArc = d3.svg.arc()
  	.innerRadius(RADIUS * 0.9)
  	.outerRadius(RADIUS * 0.9);

  var color = d3.scale.category20();


  /* ------- FUNCTIONS WITH SIDE EFFECTS -------*/

  function mergeWithFirstEqualZero(first, second){
  	var secondSet = d3.set(); second.forEach(function(d) { secondSet.add(d.label); });

  	var onlyFirst = first
  		.filter(function(d){ return !secondSet.has(d.label) })
  		.map(function(d) { return {label: d.label, value: 0}; });
  	return d3.merge([ second, onlyFirst ])
  		.sort(function(a,b) {
  			return d3.ascending(a.label, b.label);
  		});
  }
  function bindData (data) {
  	//anonymous functions

  	var labels = data.map(function(d){return d[Object.keys(d)[0]]});
  	var values = data.map(function(d){return d[Object.keys(d)[1]]});
  	color = d3.scale.category20().domain(labels);

  	return labels.map(function(d,i){
  		return { label: d, value: values[i] }
  	}).sort(function(a,b) {
  		return d3.ascending(a.label, b.label);
  	});
  }

  //private state variables
  var chart = {};
  chart.data = bindData(data);
  chart.svg = createNew(divId);

  function createNew(divId) {
    return d3.select(divId).append("svg")
             .attr("width", WIDTH + MARGIN.left + MARGIN.right)
             .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
             .append("g")
             .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");
  }
  chart.svg.append("g")
    .attr("class", "slices");
  chart.svg.append("g")
    .attr("class", "labels");
  chart.svg.append("g")
    .attr("class", "lines");
  chart.svg.attr("transform", "translate(" + WIDTH / 2 + "," + HEIGHT / 2 + ")");

  chart.svg.append("g")
     .attr("class", "inner-slices");

  /* ------- SLICE ARCS -------*/

  var data0 = chart.svg.select(".slices").selectAll("path.slice")
  		.data().map(function(d) { return d.data });

  if (data0.length == 0) data0 = chart.data;
  var was = mergeWithFirstEqualZero(chart.data, data0);
  var is = mergeWithFirstEqualZero(data0, chart.data);

  chart.slice = chart.svg.select(".slices").selectAll("path.slice")
     		.data(pie(was), key);

 	chart.slice.enter()
 		.insert("path")
 		.attr("class", "slice")
 		.style("fill", function(d) { return color(d.data.label); })
 		.each(function(d) {
 			this._current = d;
 		});

 	chart.slice = chart.svg.select(".slices").selectAll("path.slice")
 		.data(pie(is), key);

  chart.slice.transition().duration(duration)
       .attrTween("d", function(d) {
           var interpolate = d3.interpolate(this._current, d);
           var _this = this;
           return function(t) {
             _this._current = interpolate(t);
             return arc(_this._current);
           };
         });

  chart.slice
       .on("mouseover",sliceMouseover)// sliceMmouseover is defined below.
       .on("click",sliceClick);// sliceMmouseover is defined below.


 /* ------- SLICE EVENTS -------*/
 function sliceMouseover(d) {
   d3.select("#selected-label").text(d.data.label);

   dataInner = [{label: d.data.label, value: 1}];
   chart.svg.select(".inner-slices").selectAll("path.slice-inner").remove();
   chart.svg.select(".inner-slices").selectAll("text", "g").remove();

   var sliceInner = chart.svg.select(".inner-slices").selectAll("path.slice-inner")
     .data(pie(dataInner), key);

   sliceInner.enter()
     .insert("path")
     .attr("class", "slice-inner")
     .style("fill", function(d) { return color(d.data.label); })
     .each(function(d) {
       this._current = d;
     });

   chart.svg.select(".inner-slices").insert("text", "g")
           .text(d.data.label+ ", "+d.data.value)
           .attr("font-family", "sans-serif")
           .attr("font-size", "12px")
           .attr("fill", "white")
           .attr("text-anchor", "middle");

   sliceInner
     .transition().duration(0)
     .attrTween("d", function(d) {
       var interpolate = d3.interpolate(this._current, d);
       var _this = this;
       return function(t) {
         _this._current = interpolate(t);
         return arcInner(_this._current);
       };
     });

  sliceInner
       .exit().transition().delay(0).duration(0)
       .remove();

   }
  function sliceClick(d) {
     //d3.select('#pie-chart-desc').text(d.data.label+", "+d.value);
   }

  /* ------- TEXT LABELS -------*/
  chart.text = chart.svg.select(".labels").selectAll("text").data(pie(was), key);
  chart.text.enter()
       .append("text")
       .attr("dy", ".35em")
       .style("opacity", 0)
       .text(function(d) {
         return d.data.label;
       })
       .each(function(d) {
         this._current = d;
       });
  function midAngle(d){
    return d.startAngle + (d.endAngle - d.startAngle)/2;
  }

  chart.text = chart.svg.select(".labels").selectAll("text").data(pie(is), key);
  chart.text.transition().duration(duration)
       .style("opacity", function(d) {
         return d.data.value == 0 ? 0 : 1;
       })
       .attrTween("transform", function(d) {
         var interpolate = d3.interpolate(this._current, d);
         var _this = this;
         return function(t) {
           var d2 = interpolate(t);
           _this._current = d2;
           var pos = outerArc.centroid(d2);
           pos[0] = RADIUS * (midAngle(d2) < Math.PI ? 1 : -1);
           return "translate("+ pos +")";
         };
       })
       .styleTween("text-anchor", function(d){
         var interpolate = d3.interpolate(this._current, d);
         return function(t) {
           var d2 = interpolate(t);
           return midAngle(d2) < Math.PI ? "start":"end";
         };
       });

  chart.text = chart.svg.select(".labels").selectAll("text").data(pie(chart.data), key);

  chart.text
       .exit().transition().delay(duration)
       .remove();

  /* ------- SLICE TO TEXT POLYLINES -------*/
  chart.polyline = chart.svg.select(".lines").selectAll("polyline").data(pie(was), key);

  chart.polyline.enter()
       .append("polyline")
       .style("opacity", 0)
       .each(function(d) {
         this._current = d;
       });

  chart.polyline = chart.svg.select(".lines").selectAll("polyline")
       .data(pie(is), key);

  chart.polyline.transition().duration(duration)
       .style("opacity", function(d) {
         return d.data.value == 0 ? 0 : .5;
       })
       .attrTween("points", function(d){
         this._current = this._current;
         var interpolate = d3.interpolate(this._current, d);
         var _this = this;
         return function(t) {
           var d2 = interpolate(t);
           _this._current = d2;
           var pos = outerArc.centroid(d2);
           pos[0] = RADIUS * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
           return [arc.centroid(d2), outerArc.centroid(d2), pos];
         };
       });

  chart.polyline = chart.svg.select(".lines").selectAll("polyline")
       .data(pie(chart.data), key);

  chart.polyline
       .exit().transition().delay(duration)
       .remove();
}
