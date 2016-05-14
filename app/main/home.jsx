var Home = React.createClass({
  componentWillMount: function() {
    this.setState({myList: myData});
  },
  getInitialState: function() {
    return {
      myList: this.props.myList
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
          <ul className="collection with-header"> {
            this.props.myList.map(function(d, i) {
              if(d.key<0) {
                return(
                  <li key={i} className="collection-item avatar">
                    <img className="circle" src={"assets/images/"+d.favicon+".png"} />
                    <span className="entry-header">
                      <a target="_blank" href={d.url}>{d.title} <i className="tiny material-icons">open_in_new</i></a>
                    </span>
                    <Tags2 tags={[d.tag1,d.tag2,d.tag3,d.tag4,d.tag5]} />
                    <div className="entry-meta">
                      <span><a href=""><i className="material-icons author">&#xE866;</i>{d.username}</a></span>
                      <span><a href=""><i className="material-icons date">&#xE192;</i>April 18, 2016</a></span>
                      <span><a href=""><i className="material-icons comments">&#xE0BF;</i>Comments</a></span>
                    </div>

                    <p>{d.description}</p>

                  </li>
                );
              }else {
                return(
                  <li key={i} className="collection-item avatar">
                    <img className="circle" src={"assets/images/"+d.favicon+".png"} />
                    <span className="entry-header">
                      <a href={d.url}>{d.title}</a>
                    </span>
                    <Tags2 tags={[d.tag1,d.tag2,d.tag3,d.tag4,d.tag5]} />
                    <div className="entry-meta">
                      <span><a href=""><i className="material-icons author">&#xE866;</i>{d.username}</a></span>
                      <span><a href=""><i className="material-icons date">&#xE192;</i>April 18, 2016</a></span>
                      <span><a href=""><i className="material-icons comments">&#xE0BF;</i>Comments</a></span>
                    </div>
                    <p>{d.description}</p>

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
var Tags2 = React.createClass({
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
      <a className="readmore" href="matrix/matrix-collection.html" title="See more">See more</a>
      </footer>

    );
  }
});

ReactDOM.render(<Home myList={myData}/>, document.getElementById('home'));
