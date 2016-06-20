var List = React.createClass({

  render: function() {
    return (
      <div>
        <div className="section-list">
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
