var Dashboard = React.createClass({
  loadUserData: function() {

    var filePath = this.props.url;
    d3.json(filePath, function(error, json) {
      if(error) return console.warn("failed to load tagfilter:  "+error);
      this.setState({
        username: json.user.name,
        userPicUrl: json.user.picUrl,
        binders: json.binders,
        tags: json.tags,
        // CORS-enabled server.
        bookmarksUrl: "https://spreadsheets.google.com/tq?key=" + json.bookmarks.key + json.bookmarks.query
      });
      router(); /* from //app/router.js */
    }.bind(this));
  },
  renderDataVis: function() {
    ReactDOM.render(<Work/>, document.getElementById('work'));
  },
  componentDidMount: function() {
    this.loadUserData();
  },
  getInitialState: function() {
    return {
      username: "",
      userPicUrl: "",
      binders: [],
      tags: [],
      bookmarksUrl: "google.com",
      bookmarksData: []
    }
  },
  render: function() {
    return (
      <div>
        <TopNav profileName={this.state.username} picUrl={this.state.userPicUrl}/>
        <SideNav profileName={this.state.username} binders={this.state.binders} picUrl={this.state.userPicUrl}/>
        <div className="main-content row page-wrap">
          <div id="work-page" className="pages">
            <Work mdUrl="assets/md/work.md" />
          </div>
          <div id="about-page" className="pages">
            <About mdUrl="assets/md/about.md" />
          </div>
          <div id="resume-page" className="pages">
            <Resume />
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <Dashboard url={"assets/data/profile/"+dashboard.user.username+".json"} />,
  document.getElementById('dashboard')
);
