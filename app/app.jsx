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
  dashboard.bookmarks = {};
  dashboard.bookmarks.data = [];
  dashboard.url = "google.com";
  var filePath = "assets/data/profile/"+dashboard.user+".json";
  d3.json(filePath, function(error, json) {
    if(error) return console.warn("failed to load tagfilter:  "+error);
    dashboard.dataset = json;
    dashboard.bookmarks = json.bookmarks;
    // CORS-enabled server.
    dashboard.url = "https://spreadsheets.google.com/tq?key=" + dashboard.bookmarks.key + dashboard.bookmarks.query;

    loadBookmarksFromServer(dashboard.url);
    renderProfile();
  });
}

function loadBookmarksFromServer(url) {
  d3.csv(url, function(error, data) {
    if(error) {
      console.log("ERROR IN D3 CSV LOADING")
      dashboard.bookmarks.data = error;
    } else {
      dashboard.bookmarks.data = data;
      renderDataVis();
    }
  })
}

function renderProfile() {
  ReactDOM.render(<TopNav profileName={dashboard.dataset.user.name}/>, document.getElementById('react-top-nav'));
  ReactDOM.render(<SideNav/>, document.getElementById('react-side-nav'));
  ReactDOM.render(<Life/>, document.getElementById('life'));
}

function renderDataVis() {
  ReactDOM.render(<BookmarksList data={dashboard.bookmarks.data} pollInterval={100000}/>, document.getElementById('bookmarks'));
  ReactDOM.render(<Pie divId="pie" data={dashboard.bookmarks.data} pollInterval={100000}/>, document.getElementById('pie'));
  ReactDOM.render(<Matrix divId="matrix" data={dashboard.bookmarks.data} pollInterval={100000}/>, document.getElementById('matrix'));
}


var SideNav = React.createClass({
  getInitialState: function() {
    return {
      user: dashboard.dataset.user,
      binders: [],
      tags: []
    }
  },
  componentWillMount: function(){ //constructor
    this.setState(
      {
        user: dashboard.dataset.user,
        binders: dashboard.dataset.binders,
        tags: dashboard.dataset.tags
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
              <a href="#" id="user-info">{this.state.user.name}</a>
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
