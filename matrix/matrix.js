var margin = { top: 80, right: 0, bottom: 100, left: 80 },
    padding = 2;
    width = 960 - margin.left - margin.right,
    height = 430 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 24),
    legendElementWidth = gridSize*2,
    tooltipHeight = 20,
    buckets = 9,
    mediaIcons = {Image: '\ue3f4', Video: '\ue04a', Answer: '\ue8fd', Article: '\ue02f', Code: '\ue86f', Tutorial: '\ue8fd'  } //Materials
    //mediaIcons = {Image: '\uf03e', Video: '\uf16a', Answer: '\uf059', Article: '\ue02f', Code: '\uf121', Tutorial: '\ue8fd'  } //FontAwesome
    mediaImages = {Image: 'oatmeal/0.png', Video: 'oatmeal/1.png', Answer: 'oatmeal/2.png', Article: 'oatmeal/3.png', Code: 'oatmeal/4.png', Tutorial: 'oatmeal/5.png'  }
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
    var values = data.map(function(d){return objVal(d,2)});
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
        .attr("class", "tag-label");

    var mediaLabels = svg.selectAll(".media-label");
    bindMediaLabel("image", mediaLabels, labels.media);

    function bindMediaLabel(type, mediaLabels, data) {
      if(type=="icon") {
        mediaLabels.data(data)
          .enter().append("text")
          .attr("x", function(d, i) { return i * gridSize; })
          .attr("y", 0)
          .attr("class", "media-label mediatype-icon")
          .attr("transform", "translate(" + gridSize / 6 + ", -2)")
          .attr("value", function(d) {return d;})
          .text(function(d) { return mediaIcons[d]; })
          .attr("font-family","FontAwesome");
      } else if(type == "image") {
        mediaLabels.data(data)
          .enter().append("svg:image")
          .attr("x", function(d, i) { return i * gridSize; })
          .attr("y", 0)
          .attr("width", 35)
          .attr("height", 35)
          .attr("xlink:href", function(d) {return mediaImages[d];})
          .attr("class", "media-label mediatype-image")
          .attr("transform", "translate(2 , -30)")
          //.attr("transform", "translate(" + gridSize / 6 + ", -22)")
          .attr("value", function(d) {return d;});
      } else if(type == "text") {
        mediaLabels.data(data)
          .enter().append("text")
          .attr("x", function(d, i) { return i * gridSize; })
          .attr("y", 0)
          .attr("class", "media-label axis-mediatype")
          .attr("transform", "translate(" + gridSize / 2 + ", -2)")
          .attr("value", function(d) {return d;})
          .text(function(d) { return d; })
          .style("text-anchor", "middle")
          .attr("class", "media-label mono");
          //.attr("class", function(d, i) { return ((i >= data.length/2) ? "media-label mono axis axis-mediatype" : "media-label mono axis"); })
      }

    }

    var colorScale = d3.scale.quantile()
        .domain([0, d3.max(data, function (d) { return parseFloat(objVal(d,2)); })])
        .range(colors);

    var boxes = svg.selectAll(".box")
        .data(data, function(d) {return objVal(d,0)+':'+objVal(d,1);});

    //boxes.append("title"); //The tooltip

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

    function resetGrid() {
      //reset everything
      svg.selectAll(".box").classed("selected-bordered", false);
      svg.selectAll(".tag-label").classed("selected-taglabel", false);
      mediaLabelUnhighlight();
    }

    /********************
     **  Interactions  **
    /********************/

    //Interaction with the boxes
    svg.selectAll(".box")
       .on("mouseover", boxMouseover)
       .on("mouseout", boxMouseout);

    function boxMouseover(d,i) {
      resetGrid();
      //highlight selected box and corresponding labels
      d3.select(this).classed("selected-bordered", true);
      var selectedMediaLabel = svg.selectAll(".media-label").filter(function(m) { return m == objVal(d,1)});
      mediaLabelHighlight(selectedMediaLabel);
      svg.selectAll(".tag-label").filter(function(m) {return m == objVal(d,0)}).classed("selected-taglabel", true);
    }

    function mediaLabelHighlight(selected) {
      selected.classed("selected-mediatype", true)
              .attr("width", 50)
              .attr("height", 50)
              .attr("transform", function(d) {
                if(selected.classed("mediatype-image")) {
                  return "translate(-6 , -40)"
                } else if(selected.classed("mediatype-icon")) {
                  return "translate(" + gridSize/9 + ", -2)"
                }
              });
    }

    function mediaLabelUnhighlight(s) {
      svg.selectAll(".media-label").classed("selected-mediatype", false)
              .attr("width", 35)
              .attr("height", 35);
      svg.selectAll(".mediatype-icon").attr("transform", "translate(" + gridSize / 6 + ", -2)");
      svg.selectAll(".mediatype-image").attr("transform", "translate(1 , -30)");
    }


    function boxMouseout(d,i) {
      resetGrid();
    }

    //Interaction with the media label
    svg.selectAll(".media-label")
       .on("mouseover", mediaLabelMouseover)
       .on("mouseout", mediaLabelMouseout);;

    //Interaction with the mediaLabel
    function mediaLabelMouseover(d) {
      resetGrid();
      mediaLabelHighlight(d3.select(this));

      //Update the tooltip position and value
      var xPosition = parseFloat(d3.select(this).attr("x"))+margin.left-gridSize/2;
      var yPosition = $("#chart").position().top + parseFloat(d3.select(this).attr("y"))-tooltipHeight;

      d3.select("#tooltip").select("#title").text("Media Type");
      d3.select("#tooltip")
        .style("left", xPosition  + "px")
        .style("top", yPosition + "px")
        .select("#value")
        .text(d);

      //Show the tooltip
      d3.select("#tooltip").classed("hidden", false);
    }

    function mediaLabelMouseout(d,i) {
      //Hide the tooltip
      d3.select("#tooltip").classed("hidden", true);
    }

    //Interaction with the tagLabel
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
