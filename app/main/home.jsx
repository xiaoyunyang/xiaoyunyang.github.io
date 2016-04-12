var Home = React.createClass({
  componentWillMount: function() {
    d3.csv("assets/data/profile/xyang-collection.csv", function(error, data) {
      if(error) {
          console.log(error);
      } else {
          this.setState({myList: data})
      }
    }.bind(this)
    );
  },
  getInitialState: function() {
    return {
      myList: []
    };
  },
  render: function() {
    return (
      <List myList={this.state.myList}/>
    );
  }
});
var List = React.createClass({
  render: function() {
    return (
      <div>
        <div className="col s12 m8 l8">
          <h4>Latest Projects and Bookmarks</h4>
          <ul className="collection with-header ll-listing"> {
            this.props.myList.map(function(d, i) {
              if(d.key<0) {
                return(
                  <li key={i} className="collection-item avatar">
                    <img className="circle" src={d.favicon} />
                    <span className="title">
                      <a target="_blank" href={d.url}>{d.title} <i className="tiny material-icons">open_in_new</i></a>
                    </span>
                    <p> - Created by: {d.username}</p>
                    <p>{d.description}</p>
                    <Tags tags={[d.tag1,d.tag2,d.tag3,d.tag4,d.tag5]} />
                  </li>
                );
              }else {
                return(
                  <li key={i} className="collection-item avatar">
                    <img className="circle" src={d.favicon} />
                    <span className="title">
                      <a href={d.url}>{d.title}</a>
                    </span>
                    <p> - Created by: {d.username}</p>
                    <p>{d.description}</p>
                    <Tags tags={[d.tag1,d.tag2,d.tag3,d.tag4,d.tag5]} />

                  </li>
                );
              }
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
      <div className="tagcloud"> {
          this.props.tags.map(function(t,i) {
            if(t!="NULL") { //a hack - will not need this after transitioning from csv to JSON
              return <a key={i}><span>{t}</span></a>
            }
          })
      }</div>
    );
  }
});

ReactDOM.render(<Home/>, document.getElementById('home'));
