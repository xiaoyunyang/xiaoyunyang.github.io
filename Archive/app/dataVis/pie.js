//PieChart Constructor
var PieChart = function(divId, data) {

  /* ------- CONSTANTS -------*/
  const MARGIN = { top: 80, right: -100, bottom: 100, left: 350 },
        PADDING = 2,
        WIDTH = 600 - MARGIN.left - MARGIN.right,
        HEIGHT = 400,
  	    RADIUS = Math.min(WIDTH, HEIGHT) / 2;
  const duration = 1000;

  var size = {};
  size.pie = document.getElementById("chart-pie").clientWidth

  var state = {};
  state.sliceClicked = false;
  state.clickedSlice = null;
  state.lastClicked = null;
  state.clickedMediaLabel = null;
  state.dataInner = null;

  var pie = d3.layout.pie()
  	.sort(null)
  	.value(function(d) {return d.value;});

  var color = d3.scale.category20();


  /* ------- FUNCTIONS WITH SIDE EFFECTS -------*/

  function mergeWithFirstEqualZero(first, second){
  	var secondSet = d3.set(); second.forEach(function(d) { secondSet.add(d.label)});

  	var onlyFirst = first
  		.filter(function(d){ return !secondSet.has(d.label) })
  		.map(function(d) { return {label: d.label, value: 0}; });
  	return d3.merge([ second, onlyFirst ])
  		.sort(function(a,b){ return d3.ascending(a.label, b.label);});
  }
  function bindData (data) {
  	//anonymous functions

  	var labels = data.map(function(d) {return d[Object.keys(d)[0]];});
  	var values = data.map(function(d) {return d[Object.keys(d)[1]];});
  	color = d3.scale.category20().domain(labels);

  	return labels.map(function(d,i){
  		return { label: d, value: values[i] }
  	}).sort(function(a,b){ return d3.ascending(a.label, b.label);});
  }

  /* ------- private state variables -------*/
  var chart = {};
  chart.data = bindData(data);
  chart.svg = createNew(divId);

  //Normal
  chart.arc = d3.svg.arc()
    .outerRadius(RADIUS * 0.8)
    .innerRadius(RADIUS * 0.4);

  //When the slice is clicked
  chart.arcOver = d3.svg.arc()
   .outerRadius(RADIUS * 0.85)
   .innerRadius(RADIUS * 0.3);

  chart.arcInner = d3.svg.arc()
    .outerRadius(RADIUS * 0.3);

  chart.outerArc = d3.svg.arc()
    .innerRadius(RADIUS * 0.9)
    .outerRadius(RADIUS * 0.9);

  function createNew(divId) {
    var svg = d3.select(divId).append("svg")
             .attr("width", WIDTH + MARGIN.left + MARGIN.right)
             .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
             .append("g");
    svg.attr("transform", `translate(${MARGIN.left/1.2}, ${HEIGHT / 2})`);
    svg.append("g").attr("class", "slices");
    svg.append("g").attr("class", "labels");
    svg.append("g").attr("class", "lines");
    svg.append("g").attr("class", "inner-slices");
    return svg;
  }

  /* ------- SLICE ARCS -------*/

  var data0 = chart.svg.select(".slices").selectAll("path.slice")
  		.data().map(function(d) {return d.data;});

  if (data0.length == 0) data0 = chart.data;
  var was = mergeWithFirstEqualZero(chart.data, data0);
  var is = mergeWithFirstEqualZero(data0, chart.data);

  chart.slice = chart.svg.select(".slices").selectAll("path.slice")
     		.data(pie(was), dvh.key);

 	chart.slice.enter()
 		.insert("path")
 		.attr("class", "slice")
 		.style("fill", function(d) {return color(d.data.label);})
 		.each(function(d) {
 			this._current = d;
 		});

 	chart.slice = chart.svg.select(".slices").selectAll("path.slice")
 		.data(pie(is), dvh.key);

  chart.slice.transition().duration(duration)
       .attrTween("d", function(d) {
           var interpolate = d3.interpolate(this._current, d);
           var _this = this;
           return function(t) {
             _this._current = interpolate(t);
             return chart.arc(_this._current);
           };
         });

  chart.slice
       .on("mouseover",sliceMouseover)// sliceMmouseover is defined below.
       .on("click",sliceClick);// sliceMmouseover is defined below.

   /* ------- TEXT LABELS -------*/
   chart.text = chart.svg.select(".labels").selectAll("text").data(pie(was), dvh.key);
   chart.text.enter()
        .append("text")
        .attr("dy", ".35em")
        .style("opacity", 0)
        .text(function(d) {return d.data.label;})
        .each(function(d){
          this._current = d;
        });
   function midAngle(d){
     return d.startAngle + (d.endAngle - d.startAngle)/2;
   }

   chart.text = chart.svg.select(".labels").selectAll("text").data(pie(is), dvh.key);
   chart.text.transition().duration(duration)
        .style("opacity", function(d) {return d.data.value == 0 ? 0 : 1;})
        .attrTween("transform", function(d) {
          var interpolate = d3.interpolate(this._current, d);
          var _this = this;
          return function(t) {
            var d2 = interpolate(t);
            _this._current = d2;
            var pos = chart.outerArc.centroid(d2);
            pos[0] = RADIUS * (midAngle(d2) < Math.PI ? 1 : -1);
            return `translate(${pos})`;
          };
        })
        .styleTween("text-anchor", function(d) {
          var interpolate = d3.interpolate(this._current, d);
          return function(t) {
            var d2 = interpolate(t);
            return midAngle(d2) < Math.PI ? "start":"end";
          };
        });

   chart.text = chart.svg.select(".labels").selectAll("text").data(pie(chart.data), dvh.key);

   chart.text
        .exit().transition().delay(duration)
        .remove();

   /* ------- SLICE TO TEXT POLYLINES -------*/
   chart.polyline = chart.svg.select(".lines").selectAll("polyline").data(pie(was), dvh.key);

   chart.polyline.enter()
        .append("polyline")
        .style("opacity", 0)
        .each(function(d) {
          this._current = d;
        });

   chart.polyline = chart.svg.select(".lines").selectAll("polyline")
        .data(pie(is), dvh.key);

   chart.polyline.transition().duration(duration)
        .style("opacity", function(d) {return d.data.value == 0 ? 0 : .5;})
        .attrTween("points", function(d) {
          this._current = this._current;
          var interpolate = d3.interpolate(this._current, d);
          var _this = this;
          return function(t) {
            var d2 = interpolate(t);
            _this._current = d2;
            var pos = chart.outerArc.centroid(d2);
            pos[0] = RADIUS * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
            return [chart.arc.centroid(d2), chart.outerArc.centroid(d2), pos];
          };
        });

   chart.polyline = chart.svg.select(".lines").selectAll("polyline")
        .data(pie(chart.data), dvh.key);

   chart.polyline
        .exit().transition().delay(duration)
        .remove();


 /********************
  **  Interactions  **
 /********************/
 function resetChartMenu() {
   chart.slice.attr("d", chart.arc)
   chart.svg.selectAll(".slice").classed("selected-bordered", false).classed("clicked-bordered", false);

   if(state.sliceClicked) {
     state.clickedSlice.classed("clicked-bordered", true);
     //mediaLabelHighlight(state.clickedMediaLabel);
     state.clickedSlice.attr("d", chart.arcOver)
   }
   chart.svg.select(".inner-slices").selectAll("path.slice-inner").remove();
   chart.svg.select(".inner-slices").selectAll("text", "g").remove();
   changeSliceInner(state.dataInner);
 }

 function sliceMouseover(d) {
   if(state.sliceClicked) return;

   d3.select(this).classed("selected-border", true);
   d3.select("#selected-label").text(d.data.label);

   state.dataInner = {label: d.data.label, value: d.data.value};

   resetChartMenu();
 }
 function changeSliceInner(dataInner, d) {
   if(dataInner==null) return;

   var sliceInner = chart.svg.select(".inner-slices")
                         .selectAll("path.slice-inner")
                         .data(pie([dataInner]), dvh.key);
   sliceInner.enter()
     .insert("path")
     .attr("class", "slice-inner")
     .style("fill", function(d) {return color(d.data.label);})
     .each(function(d) {
       this._current = d;
     });
   chart.svg.select(".inner-slices").insert("text", "g")
           .text(dataInner.label+ ", "+dataInner.value)
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
             return chart.arcInner(_this._current);
           };
       });
   sliceInner
       .exit().transition().delay(0).duration(0)
       .remove();
 }

 function sliceClick(d) {
    updateFilteredList(d.data.label, "");

    var clickedSlice = d3.select(this);

    if(this.classList.contains("clicked-bordered") && state.lastClicked == this) {
      state.sliceClicked = false;
      state.clickedSlice = null;
      state.lastClicked = this;
      state.dataInner = null;
    } else {
      state.sliceClicked = true;
      state.clickedSlice = clickedSlice;
      state.lastClicked = this;
      state.dataInner = {label: d.data.label, value: d.data.value};
    }
    resetChartMenu();

    clickedSlice.classed("selected-bordered", true)
  }
  //Event Handler from react-dom will take care changes to selected-tag-media
  function updateFilteredList(tag, mediaLabel) {
    var selected = d3.selectAll("#selected-tag-media-pie").attr("value");
    var newSelected = "("+tag+","+mediaLabel+")";
    var newSelectedDesc = (mediaLabel == "" ?  "Things" : mediaLabel+"s") + (tag == "" ? "" :  " about "+tag);

    d3.selectAll("#selected-tag-media-pie").attr("value", newSelected);
    d3.selectAll("#selected-tag-media-desc-pie").text(newSelectedDesc);

    if(selected==newSelected) {
      d3.selectAll("#selected-tag-media-pie").attr("value", "");
      d3.selectAll("#selected-tag-media-desc-pie").text("Everything");
    } else {
      d3.selectAll("#selected-tag-media-pie").attr("value", newSelected);
      d3.selectAll("#selected-tag-media-desc-pie").text(newSelectedDesc);
    }

  }

}
