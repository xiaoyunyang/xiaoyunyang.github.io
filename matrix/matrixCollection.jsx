var MatrixChart = React.createClass({

  //Helper Functions
  tags: function(data,i) {
    return (data.map(function(d){return dvh.objVal(d,i)}));
  },
  keys: function(d, t) {
    //this function creates an array of keys that contains the tag
    if(d.tag1==t || d.tag2==t || d.tag3==t || d.tag4==t || d.tag5==t){
      return [d.key];
    }
    return [];
  },
  media: function(d, t) {
    //this function creates an array of keys that contains the tag
    if(d.tag1==t || d.tag2==t || d.tag3==t || d.tag4==t || d.tag5==t){
      return [d.favicon];
    }
    return [];
  },
  allTags: function(data) {
    var uniqueTags = _.unique(
      this.tags(data,6).concat(
        this.tags(data,7),this.tags(data,8),this.tags(data,9),this.tags(data,10))
    );

    return _.reject(uniqueTags, function(d){return d=="NULL";});
  },
  tag2items: function(data) {
    /**
      returns an array of Objects in which an Object looks like:
        {keys: ["k1", "k2"], media: ["m1", "m2"], tag: "datavis"}
     **/
    var arr = [];
    var t = this.allTags(data);
    for(var i=0; i<t.length; i++) {
      //if(keys(data[i],allTags[i]))
      var k = [];
      var m = [];
      for(var j=0; j<data.length; j++) {
        k = k.concat(this.keys(data[j], t[i]));
        m = m.concat(this.media(data[j], t[i]))
      }
      arr.push({tag: t[i], keys: k, media: m});
    }
    return arr;
  },
  item2tags: function(data) {
    var arr = [];
    arr = data.map(function(d,i) {
      return {key: d.key, tags: this.allTags([data[i]])};
    }.bind(this));
    return arr;
  },
  items: function(data) {
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
  },
  collectionData: function(data) {
    return {
      items: this.items(data),
      tagToItems: this.tag2items(data),
      itemToTags: this.item2tags(data)
    };
  },
  matrixData: function(data) {
    //input data should be this.state.tag2Items
    var arr = [];
    for(i=0; i<data.length; i++) {
      var d = data[i];

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
  },
  activeMatrixData: function(items, tagToItems) {
    //DEPRECATED function
    return _.filter(items, function(d) {
      var tagMedia = _.find(tagToItems, function(a) {
        return a.tag == d.tag;
      }).media;

      return _.unique(tagMedia).length > 2;

    });
  },
  activeTagsInit: function(tagToItems) {
    //This function determines what goes into the matrix initially
    return _.filter(tagToItems, function(d) {
      return _.unique(d.media).length > 2 && d.keys.length>4;
    });
  },
  renderTags: function(divId, data, activeData) {
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
  },
  matrixVis: function(divId, visActiveData, mediaType, colorTheme) {
    d3.select(divId).selectAll("svg").remove();
    var heatmapChart = new HeatmapChart(divId, visActiveData, mediaType, colorTheme);
    heatmapChart.changeColor(divId, visActiveData, colorTheme);

    return heatmapChart;
  },
  colorsPicker: function(divId, colorThemes) {
    var colorsPicker = d3.select("#colors-picker").selectAll(".colors-button").data(colorThemes);
    colorsPicker.enter()
      .append("a")
      .attr("type", "button")
      .attr("class", function(d){ return "btn-floating waves-effect waves-light "+d; })
      .on("click", function(d) {
        this.setState({colorTheme:  d});
        this.state.heatmapChart.changeColor("#chart", this.state.visActiveData, this.state.colorTheme);
      }.bind(this));
    colorsPicker.append("i").attr("class", "material-icons").text("color_lens");

    return colorsPicker;
  },
  handleClick: function() {
    console.log("HEYO");
  },
  componentWillMount: function() {
    d3.csv("../assets/data/profile/xyang-collection.csv", function(error, data) {
      if(error) {
          console.log(error);
      } else {
        var myJson = this.collectionData(data);
        this.setState(
          {
            mediaType: this.state.mediaTypes[0],
            colorTheme: this.state.colorThemes[0],
            items: data, //TODO this is a hack. this.state.items should be this.state.json.items
            initialItems: data, //TODO this is a hack. this.state.items should be this.state.json.items
            taggedItems: data,
            json: myJson
          }, function() {
            //call back function

            this.colorsPicker("#colors-picker", this.state.colorThemes)

            var tagToItemsTemp = _.sortBy(this.state.json.tagToItems, 'tag');
            var initialTagToItemsTemp =  _.sortBy(this.state.json.tagToItems, 'tag');
            var itemToTagsTemp = this.state.json.itemToTags;
            var visDataTemp = this.matrixData(tagToItemsTemp);
            var tagToItemsActiveTemp = this.activeTagsInit(tagToItemsTemp);
            var visActiveDataTemp = this.matrixData(tagToItemsActiveTemp);

            this.setState(
              {
                tagToItems: tagToItemsTemp,
                tagToItemsActive: tagToItemsActiveTemp,
                initialTagToItems: initialTagToItemsTemp,
                itemToTags: itemToTagsTemp,
                visData: visDataTemp,
                visActiveData:  visActiveDataTemp
              }, function() {
                //the callback function

                //this.renderTags('#tags', this.state.visData, this.state.visActiveData);

                var heatmapChartTemp = this.matrixVis(
                  "#chart",
                  this.state.visActiveData,
                  this.state.mediaType,
                  this.state.colorTheme
                );
                this.setState({heatmapChart: heatmapChartTemp});
              });
          });
      }
    }.bind(this));
  },
  getInitialState: function() {
    return {
      visData: [],
      visActiveData: [],
      tagToItems: [],
      tagToItemsActive: [],
      initialTagToItems: [],
      itemToTags: [],
      json: [],

      items: [],
      initialItems: [],
      taggedItems: [],

      mediaTypes: ["icon", "image"], //this is the x-axis of the heatmap. icon is article or code, image is profile image
      colorThemes: ["green", "red", "blue", "purple"],
      mediaType: "",
      colorTheme: "",
      heatmapChart: null,
      colorsPicker: null,
      divId: this.props.divId
    };
  },
  filterListByTag: function(event) {
    var updatedItems = this.state.initialItems;
    var updatedTagToItems = this.state.initialTagToItems;

    //Check input
    var selected = d3.selectAll("#selected-tag-media").attr("value");

    if(selected===undefined || selected==="") {
        updatedItems = this.state.initialItems;
    } else {

        var tagMediaTuple = selected.toLowerCase();

        //use regex to parse the tag and mediaLabel
        var inputTag = tagMediaTuple.replace(/\(|\)/g,'').split(",")[0];
        var inputMedia = tagMediaTuple.replace(/\(|\)/g,'').split(",")[1];

        if(inputTag!="") {

          //Filter By Tag
          var withTag = _.findWhere(updatedTagToItems, {tag: inputTag});

          var withTagKey;
          if(!!withTag) {withTagKey = withTag.keys;}

          updatedItems = _.filter(updatedItems, function(d) {
              return _.contains(withTagKey, d.key);
          });
        }

        //Further Filter By MediaType / favicon
        if(inputMedia != "") {
          updatedItems = _.filter(updatedItems, function(d) {
              return d.favicon.toLowerCase() == inputMedia;
          });
        }
    }
    this.setState({items: updatedItems});
    this.setState({taggedItems: updatedItems});
  },
  filterListByName: function(event) {

    var updatedItems = this.state.taggedItems;
    updatedItems = updatedItems.filter(function(item){
      return item.title.toLowerCase().search(
              event.target.value.toLowerCase()) !== -1;
    });
    this.setState({items: updatedItems});
  },
  tagClick: function(event) {
    var tag = event.target.getAttribute("value")

    var activeTags = this.state.tagToItemsActive.map(function(d) {return d.tag;});
    var newTagToItemsActive;

    if(_.contains(activeTags, tag)) {
      newTagToItemsActive = _.filter(this.state.tagToItemsActive, function(d) {
        return d.tag != tag;
      });
    } else {
      newTagToItemsActive = this.state.tagToItems;
      activeTags = activeTags.concat(tag);
      newTagToItemsActive = _.filter(this.state.tagToItems, function(d) {
        return _.contains(activeTags, d.tag);
      });
    }
    var visActiveDataTemp = this.matrixData(newTagToItemsActive);
    var heatmapChartTemp = this.matrixVis(
      "#chart",
      visActiveDataTemp,
      this.state.mediaType,
      this.state.colorTheme
    );
    this.setState({
      tagToItemsActive: newTagToItemsActive,
      visActiveData: visActiveDataTemp,
      visActiveData: visActiveDataTemp,
      heatmapChart: heatmapChartTemp
    });
  },
  render: function() {
    return (
      <div className="row">
        <h4>Adjacency Matrix DataVis:</h4>
        <p>Click <a href="matrix/matrix.html">HERE</a> for template</p>
        <h5>Pick tags to display</h5>
        <footer className="entry-meta">
          <span className="tag-links">
            <Tags tags={dvh.tags(this.state.visData)} activeTags={dvh.tags(this.state.visActiveData)} tagClick={this.tagClick}/>
          </span>
        </footer>
        <div id="matrixchart" className="col s6">

          <h5>Toggle chart colors:</h5>
          <div id="colors-picker"></div>

          <div id="chart" onClick={this.filterListByTag}>
            <div className="tooltip hidden">
              <p><strong className="title">Title</strong></p>
              <p><span className="value">Value</span></p>
            </div>
          </div>
        </div>
        <div className="col s5">
          <h5>Filtered List:</h5>
          <input id="selected-tag-media" type="text" placeholder="Filter Items by Tag" onChange={this.filterListByTag} disabled/>
          <input type="text" placeholder="Filter Items by Name" onChange={this.filterListByName}/>
          <List items={this.state.items}/>
        </div>
      </div>
    );
  }
});

var List = React.createClass({

  render: function() {
    return (
      <div>
        <div className="">
          <ul className="collection with-header"> {
            this.props.items.map(function(d, i) {
              return(
                <li key={i} className="collection-item avatar">
                  <img className="square" src={"../assets/images/"+d.favicon+".png"} />
                  <span className="entry-header">
                    <a target="_blank" href={d.url}>{d.title} <i className="tiny material-icons">open_in_new</i></a>
                  </span>
                  <footer className="entry-meta">
                    <span className="tag-links">
                      <Tags tags={[d.tag1,d.tag2,d.tag3,d.tag4,d.tag5]} activeTags={[]} tagClick={this.tagClick}/>
                    </span>
                    <a className="readmore" href="http://xiaoyunyang.github.io/" title="See more">See more</a>
                  </footer>
                  <div className="entry-meta">
                    <span><a href=""><i className="material-icons author">&#xE866;</i>{d.username}</a></span>
                    <span><a href=""><i className="material-icons date">&#xE192;</i>April 18, 2016</a></span>
                    <span><a href=""><i className="material-icons comments">&#xE0BF;</i>Comments</a></span>
                  </div>
                  <p>{d.description}</p>
                </li>
              );
            })
          }</ul>
        </div>
      </div>
    );
  }
});


var Tags = React.createClass({
  tagClick: function(event) {
    this.props.tagClick(event);
  },
  render: function() {
    var activeTags = this.props.activeTags;
    return (
         <div>{
          this.props.tags.map(function(t,i) {
            if(t!="NULL" && _.contains(activeTags,t)) {
              return <a key={i} value={t} className="active" rel="tag" onClick={this.tagClick}>{t}</a>
            }else if(t!="NULL") {
              return <a key={i} value={t} rel="tag" onClick={this.tagClick}>{t}</a>
            }
          }.bind(this))
        }</div>
    );
  }
});

var Tag = React.createClass({
  propTypes: {
    tagClick: React.PropTypes.func,
  },
  handleClick: function(event) {
    this.props.tagClick(event);
    console.log("Inside tag handleClick");

  },
  render: function() {

    return (
      <a value={this.props.tag} className={this.props.class} rel="tag" onClick={this.props.tagClick}>{this.props.tag}</a>
    );
  }
});

var HomeList = React.createClass({
  render: function() {
    return (
      <div>
        <div className="col s12 m8 l8">
          <h4>Latest Projects and Bookmarks</h4>
          <List items={this.props.items}/>
        </div>
      </div>
    );
  }
});


ReactDOM.render(<MatrixChart divId="matrix-chart-menu"/>, document.getElementById('matrix-chart-menu'));
