//anonymous function
//TODO: need to put all these anonymous functions in a helper library
var objKey = function(d, i) {return Object.keys(d)[i]};
var objVal = function(d, i) {return d[objKey(d,i)];}

var tags = function(data) {return _.unique(data.map(function(d){return objVal(d,0)}));};
var media = function(data) {return _.unique(data.map(function(d){return objVal(d,1)}));};
var values = function(data) {return data.map(function(d){return objVal(d,2)});};

//heatmapChart Constructor
var HeatmapChart = function(divId, data, mediaType, colorTheme) {
  const MARGIN = { top: 80, right: 0, bottom: 100, left: 100 },
        PADDING = 2,
        WIDTH = 700 - MARGIN.left - MARGIN.right,
        GRID_SIZE = Math.floor(WIDTH / 15),
        HEIGHT = tags(data).length * GRID_SIZE + MARGIN.top + MARGIN.bottom,
        LEGEND_ELEM_WIDTH = GRID_SIZE * 2,
        TOOLTIP_HEIGHT = 20,
        MEDIA_ICONS = {Image: '\ue3f4', Video: '\ue04a', Discussion: '\ue8af', Article: '\ue02f', Code: '\ue86f', Tutorial: '\ue8fd', Interactive: '\ue913', Website: '\ue894'  }, //Materials
        //MEDIA_ICONS = {Image: '\uf03e', Video: '\uf16a', Answer: '\uf059', Article: '\ue02f', Code: '\uf121', Tutorial: '\ue8fd'  } //FontAwesome
        //MEDIA_IMAGES = {Image: 'oatmeal/0.png', Video: 'oatmeal/1.png', Answer: 'oatmeal/2.png', Article: 'oatmeal/3.png', Code: 'oatmeal/4.png', Tutorial: 'oatmeal/5.png'  }
        MEDIA_IMAGES = {Jake: 'uifaces/0.jpg', Adam: 'uifaces/1.jpg', Rob: 'uifaces/2.jpg', Tom: 'uifaces/3.jpg', Valerie: 'uifaces/4.jpg', Tutorial: 'uifaces/5.jpg'  },
        //COLORS = ["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"], // alternatively colorbrewer.YlGnBu[9]
        COLORS = {green: colorbrewer.Greens[4], red: colorbrewer.Reds[4], blue: colorbrewer.Blues[4], purple: colorbrewer.Purples[4]};
  var state = {};
  state.svg = null;
  state.boxClicked = false;
  state.clickedBox = null;
  state.clickedMediaLabel = null;
  state.clickedTagLabel = null;
  state.lastClicked = null;

  //getters
  this.getMargin = function() {return MARGIN;}
  this.getGridSize = function() {return GRID_SIZE;}
  this.getColors = function() {return COLORS;}
  this.getLegendElemWidth = function() {return LEGEND_ELEM_WIDTH;}
  this.getboxClicked = function() {return state.boxClicked;}

  //private state variables
  var chart = {};
  chart.tags = tags(data);
  chart.media = media(data);
  chart.svg = createNew(divId);

  function createNew(divId) {
    return d3.select(divId).append("svg")
             .attr("width", WIDTH + MARGIN.left + MARGIN.right)
             .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
             .append("g")
             .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");
  }

  chart.svg.selectAll(".tag-label").remove();
  chart.svg.selectAll(".media-label").remove();
  resetGrid();
  d3.selectAll("#selected-tag-media").attr("value", "");

  var tagLabels = chart.svg.selectAll(".tag-label").data(chart.tags);
  tagLabels.enter()
    .append("text")
    .text(function (d) { return d; })
    .attr("x", 0)
    .attr("y", function (d, i) { return i * GRID_SIZE; })
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + GRID_SIZE / 1.5 + ")")
    .attr("class", "tag-label");
  tagLabels.exit().remove();

  var mediaLabels = bindMediaLabel(mediaType, ".media-label", chart.media);
  mediaLabels.exit().remove();

  function bindMediaLabel(type, className, data) {
    var mediaLabels = chart.svg.selectAll(".media-label").data(data);
    if(type=="icon") {
      mediaLabels.enter()
        .append("text")
        .attr("x", function(d, i) { return i * GRID_SIZE; })
        .attr("y", 0)
        .attr("class", "media-label mediatype-icon")
        .attr("transform", "translate(" + GRID_SIZE / 6 + ", -2)")
        .attr("value", function(d) {return d;})
        //.attr("font-family","FontAwesome")
        .text(function(d) { return MEDIA_ICONS[d]; });
    } else if(type == "image") {
      mediaLabels.enter()
        .append("svg:image")
        .attr("x", function(d, i) { return i * GRID_SIZE; })
        .attr("y", 0)
        .attr("width", 25)
        .attr("height", 25)
        .attr("xlink:href", function(d) {return MEDIA_IMAGES[d];})
        .attr("class", "media-label mediatype-image")
        .attr("transform", "translate(4 , -30)")
        //.attr("transform", "translate(" + GRID_SIZE / 6 + ", -22)")
        .attr("value", function(d) {return d;});
    } else if(type == "text") {
      mediaLabels.enter()
        .append("text")
        .attr("x", function(d, i) { return i * GRID_SIZE; })
        .attr("y", 0)
        .attr("class", "media-label axis-mediatype")
        .attr("transform", "translate(" + GRID_SIZE / 2 + ", -2)")
        .attr("value", function(d) {return d;})
        .text(function(d) { return d; })
        .style("text-anchor", "middle")
        .attr("class", "media-label mono");
        //.attr("class", function(d, i) { return ((i >= data.length/2) ? "media-label mono axis axis-mediatype" : "media-label mono axis"); })
    }
    return mediaLabels;
  }


  var boxes = chart.svg.selectAll(".box")
                 .data(data, function(d) {return objVal(d,0)+':'+objVal(d,1);});

  boxes.enter().append("rect")
      .attr("x", function(d) { return (_.indexOf(chart.media, objVal(d,1))) * GRID_SIZE + PADDING; })
      .attr("y", function(d) { return (_.indexOf(chart.tags, objVal(d,0))) * GRID_SIZE + PADDING; })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("class", "box bordered")
      .attr("width", GRID_SIZE - PADDING * 2)
      .attr("height", GRID_SIZE - PADDING * 2)
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

  //Event Handler from react-dom will take care changes to selected-tag-media
  function updateFilteredList(tag, mediaLabel) {
    var selected = d3.selectAll("#selected-tag-media").attr("value");
    var newSelected = "("+tag+","+mediaLabel+")";
    d3.selectAll("#selected-tag-media").attr("value", newSelected);

    if(selected==newSelected) {
      d3.selectAll("#selected-tag-media").attr("value", "");
    } else {
      d3.selectAll("#selected-tag-media").attr("value", newSelected);
    }

  }
  function boxClick(d,i) {

    updateFilteredList(d.tag, d.mediaLabel);

    resetGrid();
    var clickedBox = d3.select(this);

    if(this.classList.contains("clicked-bordered") && state.lastClicked == this) {
      state.boxClicked = false;
      state.clickedBox = null;
      state.clickedMediaLabel = null;
      state.clickedTagLabel = null;
      state.lastClicked = this;
    } else {
      var clickedMediaLabel = chart.svg.selectAll(".media-label").filter(function(m) { return m == objVal(d,1)});
      var clickedTagLabel = chart.svg.selectAll(".tag-label").filter(function(m) {return m == objVal(d,0)});

      //mediaLabelHighlight(clickedMediaLabel);
      state.boxClicked = true;
      state.clickedBox = clickedBox;
      state.clickedMediaLabel = clickedMediaLabel;
      state.clickedTagLabel = clickedTagLabel;
      state.lastClicked = this;
    }
    //resetGrid unhighlight everything box highlights the clicked box and
    //corresponding tagLabels and mediaLabels depending on the state variables above
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
    var xPosition = $(divId).position().left + GRID_SIZE * chart.media.length + MARGIN.left*1.5;
    var yPosition = $(divId).position().top + parseFloat(d3.select(this).attr("y")) + TOOLTIP_HEIGHT * 3;

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
                return "translate(" + GRID_SIZE / 9 + ", -2)"
              }
            });
  }

  function mediaLabelUnhighlight() {
    chart.svg.selectAll(".media-label").classed("selected-medialabel", false)
       .attr("width", 25)
       .attr("height", 25);
    chart.svg.selectAll(".mediatype-icon").attr("transform", "translate(" + GRID_SIZE / 6 + ", -2)");
    chart.svg.selectAll(".mediatype-image").attr("transform", "translate(4 , -30)");
  }


  function boxMouseout(d,i) {
    resetGrid();
    d3.select(divId).selectAll(".tooltip").classed("hidden", true); //Hide the tooltip
  }

  //Interaction with the media label
  chart.svg.selectAll(".media-label")
       .on("mouseover", mediaLabelMouseover)
       .on("mouseout", mediaLabelMouseout)
       .on("click", mediaLabelClick);

  //Interaction with the mediaLabel
  function mediaLabelMouseover(d) {
    resetGrid();
    mediaLabelHighlight(d3.select(this));

    //Update the tooltip position and value
    var xPosition = $(divId).position().left+parseFloat(d3.select(this).attr("x")) + MARGIN.left - GRID_SIZE / 2;
    var yPosition = $(divId).position().top + parseFloat(d3.select(this).attr("y"))-TOOLTIP_HEIGHT;

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

  function mediaLabelClick(d,i) {

    updateFilteredList("", d);

    resetGrid();
    var clickedMediaLabel = d3.select(this);

    if(this.classList.contains("clicked-medialabel") && state.lastClicked == this) {
      state.boxClicked = false;
      state.clickedBox = null;
      state.clickedMediaLabel = null;
      state.clickedTagLabel = null;
      state.lastClicked = this;
    } else {

      var clickedBox = chart.svg.selectAll(".box").filter(function(m) {return objVal(m,1) == d;})

      var tags = [];
      chart.svg.selectAll(".box").each(function(m) {
        if(objVal(m,1) == d) {
          tags = tags.concat(objVal(m,0));
        }
      });

      var clickedTagLabel = chart.svg.selectAll(".tag-label").filter(
        function(m) { return _.contains(tags, m); }
      );

      //mediaLabelHighlight(clickedMediaLabel);
      state.boxClicked = true;
      state.clickedBox = clickedBox;
      state.clickedMediaLabel = clickedMediaLabel;
      state.clickedTagLabel = clickedTagLabel;
      state.lastClicked = this;
    }
    //resetGrid unhighlight everything box highlights the clicked box and
    //corresponding tagLabels and mediaLabels depending on the state variables above
    resetGrid();
  }

  //Interaction with the tagLabel
  chart.svg.selectAll(".tag-label")
       .on("mouseover", tagLabelMouseover)
       .on("click", tagLabelClick);

  function tagLabelMouseover(d) {
    resetGrid();
    d3.select(this).classed("selected-taglabel", true);
  }

  function tagLabelClick(d,i) {

    updateFilteredList(d,"");

    resetGrid();
    var clickedTagLabel = d3.select(this);

    if(this.classList.contains("clicked-taglabel") && state.lastClicked == this) {
      state.boxClicked = false;
      state.clickedBox = null;
      state.clickedMediaLabel = null;
      state.clickedTagLabel = null;
      state.lastClicked = this;
    } else {

      var clickedBox = chart.svg.selectAll(".box").filter(function(m) {return objVal(m,0) == d;});

      var media = [];
      chart.svg.selectAll(".box").each(function(m) {
        if(objVal(m,0) == d) {
          media = media.concat(objVal(m,1));
        }
      });
      var clickedMediaLabel = chart.svg.selectAll(".media-label").filter(
        function(m) { return _.contains(media, m); }
      );

      //mediaLabelHighlight(clickedMediaLabel);
      state.boxClicked = true;
      state.clickedBox = clickedBox;
      state.clickedMediaLabel = clickedMediaLabel;
      state.clickedTagLabel = clickedTagLabel;
      state.lastClicked = this;
    }
    //resetGrid unhighlight everything box highlights the clicked box and
    //corresponding tagLabels and mediaLabels depending on the state variables above
    resetGrid();
  }
};

HeatmapChart.prototype.changeColor = function(divId,data, colorTheme) {
  var margin = this.getMargin();
  var gridSize = this.getGridSize();
  var colors = this.getColors();
  var legendElemWidth = this.getLegendElemWidth();

  var colorScale = d3.scale.quantile()
           .domain([0, d3.max(data, function (d) { return parseFloat(objVal(d,2)); })])
           .range(COLORS[colorTheme]);
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
         .attr("x", function(d, i) { return legendElemWidth * i; })
         .attr("y", legendY)
         .attr("width", legendElemWidth)
         .attr("height", gridSize / 2)
         .style("fill", function(d, i) { return colors[colorTheme][i]; });

   legend.append("text")
         .attr("class", "mono")
         .text(function(d) { return "≥ " + Math.round(d); })
         .attr("x", function(d, i) { return legendElemWidth * i; })
         .attr("y", legendY + gridSize);

   legend.exit().remove();

   svg.selectAll(".legend").selectAll("rect").transition().duration(1000)

}
