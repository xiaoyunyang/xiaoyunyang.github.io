var SideNav = React.createClass({
  componentDidMount: function() {
    $('.collapsible').collapsible({
      accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
  },
  render: function () {
    return (
      <div className="perm side-nav fixed">
        <h4 id="user-info">{this.props.profileName}</h4>
        <img className="circle" src={this.props.picUrl}/>
        <SideBinders binders={this.props.binders}/>
      </div>
    );
  }
});
var SideBinders = React.createClass({
  render: function () {
    return (
      <ul className="collapsible pills" data-collapsible="expandable">
        <div className="row">
          <div className="col l2 m2 offset-l1 offset-m1">
            <a target="_blank" href="https://github.com/xiaoyunyang">
              <i className="fa fa-github fa-lg"></i>
            </a>
          </div>
          <div className="col l2 m2">
            <a target="_blank" href="https://www.linkedin.com/in/xiaoyun-yang-380a9874">
              <i className="fa fa-linkedin fa-lg"></i>
            </a>
          </div>
          <div className="col l2 m2">
            <a target="_blank" href="https://medium.com/@xiaoyunyang">
              <i className="fa fa-medium fa-lg"></i>
            </a>
          </div>
          <div className="col l2 m2">
            <a href="mailto:xiaoyun@looseleafapp.com">
              <i className="fa fa-envelope fa-lg"></i>
            </a>
          </div>
        </div>
        <li><div className="divider"></div></li>
        {
          this.props.binders.map(function(item) {
            return (
              <li key={item.alias} className={""+item.alias+"-pill"}><a href={"#"+item.alias}>{item.name}</a></li>
            );
          })
        }
      </ul>
    );
  }
});

var SideTags = React.createClass({
  render: function () {
    return (
      <li>
        <div className="collapsible-header active">Likes</div>
        <div className="collapsible-body">
          <ul className="collection with-header valign pills"> {
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
