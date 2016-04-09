var margin = { top: 50, right: 0, bottom: 100, left: 50 },
    padding = 2;
    width = 960 - margin.left - margin.right,
    height = 430 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 24),
    legendElementWidth = gridSize*2,
    buckets = 9,
    colors = ["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"], // alternatively colorbrewer.YlGnBu[9]
    datasets = ["data.csv", "data2.csv"];

//anonymous function
var objKey = function(d, i) {return Object.keys(d)[i]};
var objVal = function(d, i) {return d[objKey(d,i)];}

var svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var heatmapChart = function(data) {
    var tags = _.unique(data.map(function(d){return objVal(d,0)}));
    var media = _.unique(data.map(function(d){return objVal(d,1)}));
    var labels = {};
    labels.tags = tags;
    labels.media = media;

    //resetGrid();
    svg.selectAll(".tag-label").remove();
    svg.selectAll(".media-label").remove();
    var tagLabels = svg.selectAll(".tag-label")
        .data(labels.tags)
        .enter().append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return i * gridSize; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
        .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "tag-label mono axis axis-taglabel" : "tag-label mono axis"); });

    var mediaLabels = svg.selectAll(".media-label")
        .data(labels.media)
        .enter().append("text")
        .text(function(d) { return d; })
        .attr("x", function(d, i) { return i * gridSize; })
        .attr("y", 0)
        .attr("value", function(d) {return d;})
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + gridSize / 2 + ", -6)")
        .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "media-label mono axis axis-mediatype" : "media-label mono axis"); });

    var colorScale = d3.scale.quantile()
        .domain([0, buckets - 1, d3.max(data, function (d) { return objVal(d,2); })])
        .range(colors);

    var boxes = svg.selectAll(".box")
        .data(data, function(d) {return objVal(d,0)+':'+objVal(d,1);});

    boxes.append("title");

    boxes.enter().append("rect")
        .attr("x", function(d) { return (_.indexOf(labels.media, objVal(d,1))) * gridSize + padding; })
        .attr("y", function(d) { return (_.indexOf(labels.tags, objVal(d,0))) * gridSize + padding; })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "box bordered")
        .attr("width", gridSize - padding*2)
        .attr("height", gridSize - padding*2)
        .style("fill", colors[0]);

    boxes.transition().duration(1000)
        .style("fill", function(d) { return colorScale(objVal(d,2));});

    boxes.select("title").text(function(d) { return objVal(d,2);});

    boxes.exit().remove();

    //Interaction with the boxes
    svg.selectAll(".box").on("mouseover", boxMouseover);

    function boxMouseover(d,i) {
      resetGrid();

      //highlight selected box and corresponding labels
      d3.select(this).classed("selected-bordered", true);
      mediaLabels.filter(function(m) {return m == objVal(d,1)}).classed("selected-mediatype", true);
      tagLabels.filter(function(m) {return m == objVal(d,0)}).classed("selected-taglabel", true);
    }

    function resetGrid() {
      //reset everything
      svg.selectAll(".box").classed("selected-bordered", false);
      svg.selectAll(".media-label").classed("selected-mediatype", false);
      svg.selectAll(".tag-label").classed("selected-taglabel", false);
    }
    //Interaction with the media label
    svg.selectAll(".media-label").on("mouseover", mediaLabelMouseover);
    function mediaLabelMouseover(d) {
      resetGrid();
      d3.select(this).classed("selected-mediatype", true);
      //console.log(this.getAttribute("value"));
    }
    //Interaction with the tag label
    svg.selectAll(".tag-label").on("mouseover", tagLabelMouseover);
    function tagLabelMouseover(d) {
      resetGrid();
      d3.select(this).classed("selected-taglabel", true);
    }

    var legend = svg.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) { return d; });

    legend.enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height)
      .attr("width", legendElementWidth)
      .attr("height", gridSize / 2)
      .style("fill", function(d, i) { return colors[i]; });

    legend.append("text")
      .attr("class", "mono")
      .text(function(d) { return "≥ " + Math.round(d); })
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height + gridSize);

    legend.exit().remove();
};

d3.csv("data.csv", function(error, data) {
  if(error) {
    console.log(error);
  } else {
    heatmapChart(data)
  }
});

var datasetpicker = d3.select("#dataset-picker").selectAll(".dataset-button")
  .data(datasets);

datasetpicker.enter()
  .append("input")
  .attr("value", function(d){ return "Dataset " + d })
  .attr("type", "button")
  .attr("class", "dataset-button")
  .on("click", function(d) {
    d3.csv(d, function(error, data) {
      if(error) {
        console.log(error);
      } else {
        heatmapChart(data);
      }
    });
});
