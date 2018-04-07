var Pie = React.createClass({
  //Helper Functions
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
    var tags = function(data, i){ return data.map(function(d){ return dvh.objVal(d,i);})};
    var uniqueTags = _.unique(
      tags(data,6).concat(
        tags(data,7), tags(data,8), tags(data,9), tags(data,10))
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
    var biggestTenTags = _.last(sortedPieData, 10).map(function(d){return d.tag;});
    return _.filter(tagToItems, function(d) {return _.contains(biggestTenTags, d.tag);});
  },

  pieVis: function(divId, visActiveData) {
    d3.select(divId).selectAll("svg").remove();
    var pieChart = new PieChart(divId, visActiveData);
    return pieChart;
  },
  pieData: function(tagToItems) {
    var pieData = tagToItems.map(function(d) {
      return {tag: d.tag, value: `${d.keys.length}`}
    });
    return pieData;
  },
  updateProps: function(csvDat) {
    var data = csvDat;
    var myJson = this.collectionData(csvDat);
    this.setState(
      {
        items: data, //TODO this is a hack. this.state.items should be this.state.json.items
        initialItems: data, //TODO this is a hack. this.state.items should be this.state.json.items
        taggedItems: data,
        json: myJson
      }, function() {
        //call back function
        var tagToItemsTemp = _.sortBy(this.state.json.tagToItems, function(d) {return d.tag.toLowerCase()});
        var initialTagToItemsTemp =  _.sortBy(this.state.json.tagToItems, function(d) {return d.tag.toLowerCase()});
        var itemToTagsTemp = this.state.json.itemToTags;
        var tagToItemsActiveTemp = this.activeTagsInit(tagToItemsTemp);
        var visDataTemp = this.pieData(tagToItemsTemp);
        var visActiveDataTemp = this.pieData(tagToItemsActiveTemp);

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
            var pieChartTemp = this.pieVis("#chart-pie", this.state.visActiveData);
            this.setState({pieChart: pieChartTemp});
          });

      });
  },
  componentWillMount: function() {
    this.updateProps(this.props.data);
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
  filterListByTag: function(event) {
    var updatedItems = this.state.initialItems;
    var updatedTagToItems = this.state.initialTagToItems;

    //Check input
    var selected = d3.selectAll("#selected-tag-media-pie").attr("value");

    if(selected===undefined || selected==="") {
        updatedItems = this.state.initialItems;
    } else {

        var tagMediaTuple = selected;

        //use regex to parse the tag and mediaLabel
        var inputTag = tagMediaTuple.replace(/\(|\)/g,'').split(",")[0];
        var inputMedia = tagMediaTuple.replace(/\(|\)/g,'').split(",")[1];
        inputMedia = inputMedia.toLowerCase();

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
    }
    else {
      newTagToItemsActive = this.state.tagToItems;
      activeTags = activeTags.concat(tag);
      newTagToItemsActive = _.filter(this.state.tagToItems, function(d) {
        return _.contains(activeTags, d.tag);
      });
    }
    var visActiveDataTemp = this.pieData(newTagToItemsActive);
    var pieChartTemp = this.pieVis("#chart-pie", visActiveDataTemp);

    this.setState({
      tagToItemsActive: newTagToItemsActive,
      visActiveData: visActiveDataTemp,
      visActiveData: visActiveDataTemp,
      pieChart: pieChartTemp
    });
  },
  render: function() {
    return (
      <div className="row">
        <div className="row">
          <div className="col s12 m6 l6"><h4>A Donut Chart Menu</h4></div>
          <div className="col s12 m6 l6">
            <a className="waves-effect waves-light btn h4-aligned-btn" href="#matrix">Bring on the Heat!</a>
          </div>
        </div>
        <h5>Pick tags to display</h5>
        <footer className="entry-meta">
          <span className="tag-links">
            <Tags tags={dvh.tags(this.state.visData)} activeTags={dvh.tags(this.state.visActiveData)} tagClick={this.tagClick}/>
          </span>
        </footer>
        <div id="piechart" className="col s12 m5">
          <div id="chart-pie" onClick={this.filterListByTag}>
            <div className="tooltip hidden">
              <p><strong className="title">Title</strong></p>
              <p><span className="value">Value</span></p>
            </div>
          </div>
        </div>
        <div className="col s12 m5">
          <h5 id="selected-tag-media-desc-pie">Everything:</h5>
          <div id="selected-tag-media-pie" onChange={this.filterListByTag}></div>
          <input type="text" placeholder="Filter Items by Name" onChange={this.filterListByName}/>
          <List items={this.state.items}/>
        </div>
      </div>
    );
  }
});
