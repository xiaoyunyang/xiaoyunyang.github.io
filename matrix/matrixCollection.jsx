var MatrixChart = React.createClass({
  //Helper Functions
  tags: function(data,i) {
    return (data.map(function(d){return objVal(d,i)}));
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

    return _.filter(items, function(d) {
      var tagMedia = _.find(tagToItems, function(a) {
        return a.tag == d.tag;
      }).media;

      return _.unique(tagMedia).length > 2;

    });
  },
  renderTags: function(divId, data, activeData) {
    d3.select(divId).selectAll('a').remove();
    var tags = function(data) {return _.unique(data.map(function(d){return objVal(d,0)}));};
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
  componentWillMount: function() {
    d3.csv("xyang-collection.csv", function(error, data) {
      if(error) {
          console.log(error);
      } else {
          this.setState(
            {
              mediaType: this.state.mediaTypes[0],
              colorTheme: this.state.colorThemes[0],
              json: this.collectionData(data),
              items: data //TODO this is a hack. this.state.items should be this.state.json.items
            }
          );
          this.setState(
            {
              tagToItems: _.sortBy(this.state.json.tagToItems, 'tag'),
              itemToTags: this.state.json.itemToTags
            }
          );
          this.setState(
            {
              visData: this.matrixData(this.state.tagToItems)
            }
          );
          this.setState(
            {
              visActiveData:  this.activeMatrixData(this.state.visData, this.state.tagToItems)
            }
          );
          this.setState(
            {
              heatmapChart: this.matrixVis(
                "#chart",
                this.state.visActiveData,
                this.state.mediaType,
                this.state.colorTheme
              ),
              colorsPicker: this.colorsPicker("#colors-picker", this.state.colorThemes)
            }
          );
          this.renderTags('#tags', this.state.visData, this.state.visActiveData);
      }
    }.bind(this)
    );
  },
  getInitialState: function() {
    return {
      visData: [],
      visActiveData: [],
      tagToItems: [],
      itemToTags: [],
      items: [],
      mediaTypes: ["icon", "image"],
      colorThemes: ["green", "red", "blue", "purple"],
      mediaType: "",
      colorTheme: "",
      heatmapChart: null,
      colorsPicker: null,
      divId: this.props.divId
    };
  },
  render: function() {
    return (
      <List items={this.state.items}/>
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
                  <img className="circle" src={"../assets/css/images/"+d.favicon+".png"} />
                  <span className="entry-header">
                    <a target="_blank" href={d.url}>{d.title} <i className="tiny material-icons">open_in_new</i></a>
                  </span>
                  <Tags tags={[d.tag1,d.tag2,d.tag3,d.tag4,d.tag5]} />
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
  render: function() {
    return (
      <footer className="entry-meta">
        <span className="tag-links"> {
          this.props.tags.map(function(t,i) {
            if(t!="NULL") {
              return <a key={i} href="" rel="tag">{t}</a>
            }
          })
        }</span>
      <a className="readmore" href="matrix/matrix.html" title="See more">See more</a>
      </footer>

    );
  }
});

ReactDOM.render(<MatrixChart divId="filtered"/>, document.getElementById('filtered'));
