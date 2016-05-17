var Pie = React.createClass({
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
  activeTagsInit: function(tagToItems) {
    var sortedPieData = _.sortBy(this.pieData(tagToItems), 'value');
    var biggestTenTags = _.last(sortedPieData, 10).map(function(d) {return d.tag});
    return _.filter(tagToItems, function(d) {return _.contains(biggestTenTags, d.tag);});
  },
  pieVis: function(divId, visActiveData) {
    d3.select(divId).selectAll("svg").remove();
    var pieChart = new PieChart(divId, visActiveData);
    return pieChart;
  },
  pieData: function(tagToItems) {
    var pieData = tagToItems.map(function(d) {
      return {tag: d.tag, value: ""+d.keys.length}
    });
    return pieData;
  },
  componentWillMount: function() {
    d3.csv("xyang-collection.csv", function(error, data) {
      if(error) {
          console.log(error);
      } else {
        var myJson = this.collectionData(data);
        this.setState(
          {
            items: data, //TODO this is a hack. this.state.items should be this.state.json.items
            initialItems: data, //TODO this is a hack. this.state.items should be this.state.json.items
            taggedItems: data,
            json: myJson
          }, function() {
            var tagToItemsTemp = _.sortBy(this.state.json.tagToItems, 'tag');
            var initialTagToItemsTemp =  _.sortBy(this.state.json.tagToItems, 'tag');
            var itemToTagsTemp = this.state.json.itemToTags;
            var tagToItemsActiveTemp = this.activeTagsInit(tagToItemsTemp);
            var visDataTemp = this.pieData(tagToItemsTemp);
            var visActiveDataTemp = this.pieData(tagToItemsActiveTemp);

            this.setState({
              tagToItems: tagToItemsTemp,
              tagToItemsActive: tagToItemsActiveTemp,
              initialTagToItems: initialTagToItemsTemp,
              itemToTags: itemToTagsTemp,
              visData: visDataTemp,
              visActiveData:  visActiveDataTemp

            }, function() {
              var pieChartTemp = this.pieVis("#chart", this.state.visActiveData);
              this.setState({pieChart: pieChartTemp});
            })
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

      pieChart: null,
      divId: this.props.divId
    };
  },
  render: function() {
    return (
    <div>
      <div className="col s12 l10">
        <div id="chart"></div>
      </div>
    </div>
    );
  }
});
ReactDOM.render(<Pie/>, document.getElementById('pie'));
