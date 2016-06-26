var datasets = ["data.csv", "data2.csv", "xyang-collection.csv"],
    mediaTypes = ["icon", "image"],
    colorThemes = ["green", "red", "blue", "purple"];

var state = {};
state.svg = null;
state.boxClicked = false;
state.clickedBox = null;
state.clickedMediaLabel = null;
state.clickedTagLabel = null;
state.heatmapChart = null;
state.heatmapChart2 = null;

// Helper Functions for processing collection.csv//need to create key -> tags and tag -> keys
function collectionData(data) {
  var tags = function(data,i) {return (data.map(function(d){return dvh.objVal(d,i)}));};
  var keys = function(d, t) {
    //this function creates an array of keys that contains the tag
    if(d.tag1==t || d.tag2==t || d.tag3==t || d.tag4==t || d.tag5==t){
      return [d.key];
    }
    return [];
  }
  var media = function(d, t) {
    //this function creates an array of keys that contains the tag
    if(d.tag1==t || d.tag2==t || d.tag3==t || d.tag4==t || d.tag5==t){
      return [d.favicon];
    }
    return [];
  }

  //Helper Function to construct tag2items
  function allTags(data) {
    var uniqueTags = _.unique(
      tags(data,6).concat(
        tags(data,7),tags(data,8),tags(data,9),tags(data,10))
    );

    return _.reject(uniqueTags, function(d){return d=="NULL";});
  };

  function tag2items(data) {
    /**
      returns an array of Objects in which an Object looks like:
        {keys: ["k1", "k2"], media: ["m1", "m2"], tag: "datavis"}
     **/
    var arr = [];
    var t = allTags(data);
    for(var i=0; i<t.length; i++) {
      //if(keys(data[i],allTags[i]))
      var k = [];
      var m = [];
      for(var j=0; j<data.length; j++) {
        k = k.concat(keys(data[j], t[i]));
        m = m.concat(media(data[j], t[i]))
      }
      arr.push({tag: t[i], keys: k, media: m});
    }
    return arr;
  }

  function item2tags(data) {
    var arr = [];
    arr = data.map(function(d,i) {
      return {key: d.key, tags: allTags([data[i]])};
    });
    return arr;
  }

  function items(data) {
    var arr = data.map(function(d,i) {
      var icon = d.favicon;
      return {
        key: d.key,
        url: d.url,
        username: d.username,
        title: d.title,
        description: d.description,
        favicon: d.favicon
      }
    });
    return arr;
  }

  return {items: items(data), tagToItems: tag2items(data), itemToTags: item2tags(data)};
}
function matrixData(data) {
  var arr = [];
  for(i=0; i<data.length; i++) {
    var d = data[i];
    //helper functions
    var uniqueMedia = function(d) {
      return _.unique(d.media);
    }

    var getValue = function(d, m) {
      return _.filter(d.media, function(test) {return test==m;}).length;
    }

    arr = arr.concat(
      uniqueMedia(d).map(function(m) {
        return {tag: d.tag, mediaLabel: m, value: getValue(d, m)};
      })
    );
  }
  return arr;
}

function renderTags(divId, data, activeData) {
  d3.select(divId).selectAll('a').remove();
  var tags = function(data) {return _.unique(data.map(function(d){return dvh.objVal(d,0)}));};
  var allTags = tags(data);
  var activeTags = tags(activeData);
  var tags = d3.select('#tags').selectAll('.tag').data(allTags);
  tags.enter()
      .append("a").text(function(d){return d;})
      .attr("class", function(d) {
        return _.contains(activeTags, d) ? "active" : ""
      });
}

//Initialize
state.mediaType = mediaTypes[0];
state.colorTheme = colorThemes[0];
state.data = null;
state.activeData = null;

d3.csv("xyang-collection.csv", function(error, data) {
  if(error) {
    console.log(error);
  } else {
    var json = new collectionData(data);
  }
});

d3.csv("data.csv", function(error, data) {
  if(error) {
    console.log(error);
  } else {
    state.data = data;
    state.heatmapChart = new HeatmapChart("#chart", state.data, state.mediaType, state.colorTheme);
    state.heatmapChart.changeColor("#chart",state.data,state.colorTheme);
    state.activeData = state.data;
    renderTags('#tags', state.data, state.activeData);
  }
});
d3.csv("data2.csv", function(error, data) {
  if(error) {
    console.log(error);
  } else {
    state.heatmapChart2 = new HeatmapChart("#chart2", data, mediaTypes[1], state.colorTheme);
    state.heatmapChart2.changeColor("#chart2",data,state.colorTheme);
  }
});

var datasetPicker = d3.select("#dataset-picker").selectAll(".dataset-button").data(datasets);
var mediaTypePicker = d3.select("#mediatype-picker").selectAll(".mediatype-button").data(mediaTypes);
var colorsPicker = d3.select("#colors-picker").selectAll(".colors-button").data(colorThemes);

datasetPicker.enter()
  .append("input")
  .attr("value", function(d){ return "Dataset: " + d })
  .attr("type", "button")
  .attr("class", "dataset-button")
  .on("click", function(d) {
    d3.csv(d, function(error, data) {
      if(error) {
        console.log(error);
      } else if(d=="data2.csv" || d=="data.csv") {
        state.data = data;
        state.mediaType = (d=="data2.csv") ? "image" : "icon";
        state.activeData = state.data;

        d3.select("#chart").selectAll("svg").remove();
        state.heatmapChart = new HeatmapChart("#chart", state.data, state.mediaType, state.colorTheme);
        state.heatmapChart.changeColor("#chart",state.activeData, state.colorTheme);
        renderTags('#tags', state.data, state.activeData);

      } else if(d=="xyang-collection.csv") {
        var json = new collectionData(data);

        //create array of Objects {mediaLabel: "Image",  tag: "Design", Count: "0"}
        state.data = [];
        var t2i = _.sortBy(json.tagToItems, 'tag');
        state.data = matrixData(t2i);

        state.activeData = _.filter(state.data, function(d, i) {
          var tagMedia = _.find(t2i, function(a) {return a.tag == d.tag;}).media;
          return _.unique(tagMedia).length > 2;
        });
        //create Data visualization for activeData
        state.mediaType = "icon";
        d3.select("#chart").selectAll("svg").remove();
        state.heatmapChart = new HeatmapChart("#chart", state.activeData, state.mediaType, state.colorTheme);
        state.heatmapChart.changeColor("#chart", state.activeData, state.colorTheme);
        renderTags('#tags', state.data, state.activeData);
      }
    });
  });

mediaTypePicker.enter()
  .append("input")
  .attr("value", function(d){ return "MediaType: " + d })
  .attr("type", "button")
  .attr("class", "Mediatype-button")
  .on("click", function(d) {
    state.mediaType = d;
    state.boxClicked = false;
    d3.select("#chart").selectAll("svg").remove();
    state.heatmapChart = new HeatmapChart("#chart", state.data, state.mediaType, state.colorTheme);
    state.heatmapChart.changeColor("#chart", state.activeData, state.colorTheme);
  });
colorsPicker.enter()
  .append("input")
  .attr("value", function(d){ return "MediaType: " + d })
  .attr("type", "button")
  .attr("class", "colors-button")
  .on("click", function(d) {
    state.colorTheme = d;
    state.heatmapChart.changeColor("#chart", state.activeData, state.colorTheme);
  });
