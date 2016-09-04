$(document).ready(function () {
  $('.carousel').carousel();
  $('select').material_select();
  $('.button-collapse').sideNav({
      edge: 'right',
      closeOnClick: true
    });
  $('.collapsible').collapsible({
    accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
  });

  loadUserData();
});

function loadUserData() {
  var filePath = "assets/data/profile/"+dashboard.user.username+".json";
  dashboard.bookmarks = {};
  dashboard.bookmarks.data = [];
  dashboard.bookmarks.url = "google.com";

  d3.json(filePath, function(error, json) {
    if(error) return console.warn("failed to load tagfilter:  "+error);
    dashboard.user.name = json.user.name;
    dashboard.user.picUrl = json.user.picUrl;
    dashboard.bookmarks = {};
    dashboard.binders = json.binders;
    dashboard.tags = json.tags;

    // CORS-enabled server.
    dashboard.bookmarks.url = "https://spreadsheets.google.com/tq?key=" + json.bookmarks.key + json.bookmarks.query;

    loadBookmarksFromServer(dashboard.bookmarks.url, dashboard);
    renderProfile(dashboard.user, dashboard.binders, dashboard.tags);
  });
}

function loadBookmarksFromServer(url, dashboard) {
  d3.csv(url, function(error, data) {
    if(error) {
      console.log("ERROR IN D3 CSV LOADING")
      dashboard.bookmarks.data = error;
    } else {
      dashboard.bookmarks.data = data;
      renderDataVis(dashboard.bookmarks);
    }
  })
}

function renderProfile(user, binders, tags) {
  ReactDOM.render(<TopNav profileName={user.name} picUrl={user.picUrl}/>, document.getElementById('react-top-nav'));
  ReactDOM.render(<SideNav profileName={user.name} binders={binders} tags={tags}/>, document.getElementById('react-side-nav'));
  ReactDOM.render(<Life/>, document.getElementById('life'));
}

function renderDataVis(bookmarks) {
  ReactDOM.render(<BookmarksList data={bookmarks.data} pollInterval={100000}/>, document.getElementById('bookmarks'));
  ReactDOM.render(<Pie divId="pie" data={bookmarks.data} pollInterval={100000}/>, document.getElementById('pie'));
  ReactDOM.render(<Matrix divId="matrix" data={bookmarks.data} pollInterval={100000}/>, document.getElementById('matrix'));
}


var SideNav = React.createClass({
  getInitialState: function() {
    return {
      username: "",
      binders: [],
      tags: []
    }
  },
  componentWillMount: function(){ //constructor
    this.setState(
      {
        username: this.props.profileName,
        binders: this.props.binders,
        tags: this.props.tags
      }
    );
  },
  componentDidMount: function() {
    $('.collapsible').collapsible();
  },
  render: function () {
    return (
      <div className="perm side-nav fixed">
        <ul className="collection with-header">
            <li className="collection-header">
              <a href="#" id="user-info">{this.state.username}</a>
            </li>
        </ul>
        <ul className="collapsible" data-collapsible="expandable">
          <SideBinders binders={this.state.binders}/>
          <SideTags tags={this.state.tags}/>
        </ul>
      </div>

    );
  }
});
var SideBinders = React.createClass({
  render: function () {
    return (
      <li>
        <div className="collapsible-header active">DataVis</div>
        <div className="collapsible-body">
          <ul className="collection with-header valign pills"> {
            this.props.binders.map(function(item) {
              return (
                <li key={item.alias} className={"collection-item "+item.alias+"-pill"}><a href={"#"+item.alias}>{item.name}</a></li>
              );
            })
          }</ul>
        </div>
      </li>
    );
  }
});

var SideTags = React.createClass({
  render: function () {
    return (
      <li>
        <div className="collapsible-header active">Likes</div>
        <div className="collapsible-body">
          <ul className="collection with-header valign"> {
            this.props.tags.map(function(item) {
              return (
                <li key={item.tag} className="collection-item"><a href="">#{item.tag}</a></li>
              );
            })
          }</ul>
        </div>
      </li>
    );
  }
});
