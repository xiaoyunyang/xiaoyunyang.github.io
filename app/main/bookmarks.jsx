var BookmarksList = React.createClass({
  componentWillMount: function() {
    this.loadBookmarksFromServer();
  },
  loadBookmarksFromServer: function() {
    d3.csv(this.props.url, function(error, data) {
      if(error) {
        console.log(error);
      } else {
        this.setState({items: data});
      }
    }.bind(this));
  },
  getInitialState: function() {
    return {
      items: []
    };
  },
  render: function() {
    return (
      <div>
        <div className="col s12 m8 l8">
          <h4>Latest Projects and Bookmarks</h4>
          <List items={this.state.items}/>
        </div>
        <div className="col s12 m8 l4">
          <h5>Bookmark Collections</h5>
          <ul className="collection">
            <li className="collection-item">
              <a href="index.html">LooseLeaf</a>
              <a target="_blank" href="https://docs.google.com/spreadsheets/d/1X9PrlVeO9GCSmHw8psSD1fN_77vueV_A4EdaQrVzfO0/edit?usp=sharing" className="secondary-content"><i className="material-icons">&#xE254;</i></a>
            </li>
            <li className="collection-item">
              <a href="user-xyang.html">Xiaoyun Yang</a>
              <a target="_blank" href="https://docs.google.com/spreadsheets/d/1X9PrlVeO9GCSmHw8psSD1fN_77vueV_A4EdaQrVzfO0/edit?usp=sharing" className="secondary-content"><i className="material-icons">&#xE254;</i></a>
            </li>
            <li className="collection-item">
              <a href="user-afenner.html">Andrew Fenner</a>
              <a target="_blank" href="https://docs.google.com/spreadsheets/d/1_vSN2wfjtuTwbn6UJVJpoO3Epw71c-pigSpIpNipN6g/edit?usp=sharing" className="secondary-content"><i className="material-icons">&#xE254;</i></a>
            </li>
            <li className="collection-item">
              <a href="user-numbershapes.html">NumberShapes</a>
              <a target="_blank" href="https://docs.google.com/spreadsheets/d/1_fJp1is2UAV5hut4WfOqhWQMWAT2TyKooB8HUpLl1cA/edit?usp=sharing" className="secondary-content"><i className="material-icons">&#xE254;</i></a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});
ReactDOM.render(<BookmarksList url={source} pollInterval={100000}/>, document.getElementById('bookmarks'));
