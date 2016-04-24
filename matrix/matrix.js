//anonymous function
var objKey = function(d, i) {return Object.keys(d)[i]};
var objVal = function(d, i) {return d[objKey(d,i)];}

var tags = function(data) {return _.unique(data.map(function(d){return objVal(d,0)}));};
var media = function(data) {return _.unique(data.map(function(d){return objVal(d,1)}));};
var values = function(data) {return data.map(function(d){return objVal(d,2)});};

//heatmapChart Constructor
var HeatmapChart = function(divId, data, mediaType, colorTheme) {
  var margin = { top: 80, right: 0, bottom: 100, left: 100 },
      padding = 2;
      width = 700 - margin.left - margin.right,
      gridSize = Math.floor(width / 15),
      height = tags(data).length * gridSize + margin.top + margin.bottom,
      legendElementWidth = gridSize*2,
      tooltipHeight = 20,
      buckets = 9,
      mediaIcons = {Image: '\ue3f4', Video: '\ue04a', Discussion: '\ue8af', Article: '\ue02f', Code: '\ue86f', Tutorial: '\ue8fd', Interactive: '\ue913', Website: '\ue894'  }, //Materials
      //mediaIcons = {Image: '\uf03e', Video: '\uf16a', Answer: '\uf059', Article: '\ue02f', Code: '\uf121', Tutorial: '\ue8fd'  } //FontAwesome
      //mediaImages = {Image: 'oatmeal/0.png', Video: 'oatmeal/1.png', Answer: 'oatmeal/2.png', Article: 'oatmeal/3.png', Code: 'oatmeal/4.png', Tutorial: 'oatmeal/5.png'  }
      mediaImages = {Jake: 'uifaces/0.jpg', Adam: 'uifaces/1.jpg', Rob: 'uifaces/2.jpg', Tom: 'uifaces/3.jpg', Valerie: 'uifaces/4.jpg', Tutorial: 'uifaces/5.jpg'  },
      //colors = ["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"], // alternatively colorbrewer.YlGnBu[9]
      colors = {green: colorbrewer.Greens[4], red: colorbrewer.Reds[4], blue: colorbrewer.Blues[4], purple: colorbrewer.Purples[4]};

  this.getMargin = function() {
    return margin;
  }
  //private state variables
  var chart = {};
  chart.tags = tags(data);
  chart.media = media(data);
  chart.svg = createNew(divId);

  function createNew(divId) {
    return d3.select(divId).append("svg")
             .attr("width", width + margin.left + margin.right)
             .attr("height", height + margin.top + margin.bottom)
             .append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }

  chart.svg.selectAll(".tag-label").remove();
  chart.svg.selectAll(".media-label").remove();

  resetGrid();

  var tagLabels = chart.svg.selectAll(".tag-label")
      .data(chart.tags)
      .enter().append("text")
      .text(function (d) { return d; })
      .attr("x", 0)
      .attr("y", function (d, i) { return i * gridSize; })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
      .attr("class", "tag-label");

  var mediaLabels = chart.svg.selectAll(".media-label");


  bindMediaLabel(mediaType, mediaLabels, chart.media);

  function bindMediaLabel(type, mediaLabels, data) {
    if(type=="icon") {
      mediaLabels.data(data)
        .enter().append("text")
        .attr("x", function(d, i) { return i * gridSize; })
        .attr("y", 0)
        .attr("class", "media-label mediatype-icon")
        .attr("transform", "translate(" + gridSize / 6 + ", -2)")
        .attr("value", function(d) {return d;})
        //.attr("font-family","FontAwesome")
        .text(function(d) { return mediaIcons[d]; });
    } else if(type == "image") {
      mediaLabels.data(data)
        .enter().append("svg:image")
        .attr("x", function(d, i) { return i * gridSize; })
        .attr("y", 0)
        .attr("width", 25)
        .attr("height", 25)
        .attr("xlink:href", function(d) {return mediaImages[d];})
        .attr("class", "media-label mediatype-image")
        .attr("transform", "translate(4 , -30)")
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

  var boxes = chart.svg.selectAll(".box")
                 .data(data, function(d) {return objVal(d,0)+':'+objVal(d,1);});

  //boxes.append("title"); //The tooltip

  boxes.enter().append("rect")
      .attr("x", function(d) { return (_.indexOf(chart.media, objVal(d,1))) * gridSize + padding; })
      .attr("y", function(d) { return (_.indexOf(chart.tags, objVal(d,0))) * gridSize + padding; })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("class", "box bordered")
      .attr("width", gridSize - padding*2)
      .attr("height", gridSize - padding*2)
      .style("fill", "white");

  boxes.select("title").text(function(d) { return objVal(d,2);});
  boxes.exit().remove();

  /********************
   **  Interactions  **
  /********************/
  function resetGrid() {
    //reset everything
    chart.svg.selectAll(".box").classed("selected-bordered", false).classed("clicked-bordered", false);
    chart.svg.selectAll(".tag-label").classed("selected-taglabel", false).classed("clicked-taglabel", false);
    chart.svg.selectAll(".media-label").classed("selected-medialabel", false).classed("clicked-medialabel", false);
    mediaLabelUnhighlight();

    //...but highlight the the selected box and corresponding mediaLabel, and tagLabel
    if(state.boxClicked) {
      state.clickedBox.classed("clicked-bordered", true);
      state.clickedTagLabel.classed("clicked-taglabel", true);
      state.clickedMediaLabel.classed("clicked-medialabel", true);
      mediaLabelHighlight(state.clickedMediaLabel);
    }
  }

  //Interaction with the boxes
  chart.svg.selectAll(".box")
     .on("mouseover", boxMouseover)
     .on("mouseout", boxMouseout)
     .on("click", boxClick);

  function boxClick(d,i) {
    resetGrid();
    var clickedBox = d3.select(this);

    if(this.classList.contains("clicked-bordered")) {
      state.boxClicked = false;
      state.clickedBox = clickedBox;
      state.clickedMediaLabel = clickedMediaLabel;
      state.clickedTagLabel = clickedTagLabel;
    } else {
      var clickedMediaLabel = chart.svg.selectAll(".media-label").filter(function(m) { return m == objVal(d,1)});
      var clickedTagLabel = chart.svg.selectAll(".tag-label").filter(function(m) {return m == objVal(d,0)});

      //mediaLabelHighlight(clickedMediaLabel);
      state.boxClicked = true;
      state.clickedBox = clickedBox;
      state.clickedMediaLabel = clickedMediaLabel;
      state.clickedTagLabel = clickedTagLabel;
      //resetGrid unhighlight everything box highlights the clicked box and
      //corresponding tagLabels and mediaLabels depending on the state variables above

    }
    resetGrid();

  }
  function boxMouseover(d,i) {
    resetGrid();

    //highlight selected box and corresponding labels
    d3.select(this).classed("selected-bordered", true);
    var selectedMediaLabel = chart.svg.selectAll(".media-label").filter(function(m) { return m == objVal(d,1)});
    mediaLabelHighlight(selectedMediaLabel);
    chart.svg.selectAll(".tag-label").filter(function(m) {return m == objVal(d,0)}).classed("selected-taglabel", true);

    //Update the tooltip position and value
    var xPosition = gridSize*chart.media.length+margin.left*1.5;
    var yPosition = $(divId).position().top + parseFloat(d3.select(this).attr("y"))+tooltipHeight*3;

    d3.select(divId).selectAll(".tooltip").selectAll(".title").text("Value:");
    d3.select(divId).selectAll(".tooltip")
      .style("left", xPosition  + "px")
      .style("top", yPosition + "px")
      .selectAll(".value")
      .text(d.value + " thing(s) in this collection");

    //Show the tooltip
    d3.select(divId).selectAll(".tooltip").classed("hidden", false);
  }

  function mediaLabelHighlight(selected) {
    selected.classed("selected-medialabel", true)
            .attr("width", 38)
            .attr("height", 38)
            .attr("transform", function(d) {
              if(selected.classed("mediatype-image")) {
                return "translate(0 , -40)"
              } else if(selected.classed("mediatype-icon")) {
                return "translate(" + gridSize/9 + ", -2)"
              }
            });
  }

  function mediaLabelUnhighlight() {
    chart.svg.selectAll(".media-label").classed("selected-medialabel", false)
       .attr("width", 25)
       .attr("height", 25);
    chart.svg.selectAll(".mediatype-icon").attr("transform", "translate(" + gridSize / 6 + ", -2)");
    chart.svg.selectAll(".mediatype-image").attr("transform", "translate(4 , -30)");
  }


  function boxMouseout(d,i) {
    resetGrid();
    d3.select(divId).selectAll(".tooltip").classed("hidden", true); //Hide the tooltip
  }

  //Interaction with the media label
  chart.svg.selectAll(".media-label")
     .on("mouseover", mediaLabelMouseover)
     .on("mouseout", mediaLabelMouseout);;

  //Interaction with the mediaLabel
  function mediaLabelMouseover(d) {
    resetGrid();
    mediaLabelHighlight(d3.select(this));

    //Update the tooltip position and value
    var xPosition = parseFloat(d3.select(this).attr("x"))+margin.left-gridSize/2;
    var yPosition = $(divId).position().top + parseFloat(d3.select(this).attr("y"))-tooltipHeight;

    d3.select(divId).selectAll(".tooltip").selectAll(".title").text("Media Type");
    d3.select(divId).selectAll(".tooltip")
      .style("left", xPosition  + "px")
      .style("top", yPosition + "px")
      .selectAll(".value")
      .text(d);

    //Show the tooltip
    d3.select(divId).selectAll(".tooltip").classed("hidden", false);
  }

  function mediaLabelMouseout(d,i) {
    resetGrid();
    d3.select(divId).selectAll(".tooltip").classed("hidden", true); //Hide the tooltip
  }

  //Interaction with the tagLabel
  chart.svg.selectAll(".tag-label").on("mouseover", tagLabelMouseover);

  function tagLabelMouseover(d) {
    resetGrid();
    d3.select(this).classed("selected-taglabel", true);
  }
};

HeatmapChart.prototype.changeColor = function(divId,data, colorTheme) {
   var margin = this.getMargin();
  var colorScale = d3.scale.quantile()
           .domain([0, d3.max(data, function (d) { return parseFloat(objVal(d,2)); })])
           .range(colors[colorTheme]);
   var svg = d3.select(divId).selectAll("svg");
   svg.selectAll(".box").transition().duration(1000)
      .style("fill", function(d) { return colorScale(objVal(d,2));});


   svg.selectAll(".legend").remove();

   var legend = svg.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) { return d; });

   var legendY = tags(data).length * gridSize + margin.top * 1.5;

   legend.enter().append("g")
         .attr("transform", "translate(" + margin.left + "," + 0 + ")")
         .attr("class", "legend");

   legend.append("rect")
         .attr("x", function(d, i) { return legendElementWidth * i; })
         .attr("y", legendY)
         .attr("width", legendElementWidth)
         .attr("height", gridSize / 2)
         .style("fill", function(d, i) { return colors[colorTheme][i]; });

   legend.append("text")
         .attr("class", "mono")
         .text(function(d) { return "≥ " + Math.round(d); })
         .attr("x", function(d, i) { return legendElementWidth * i; })
         .attr("y", legendY + gridSize);

   legend.exit().remove();

   svg.selectAll(".legend").selectAll("rect").transition().duration(1000)

}
