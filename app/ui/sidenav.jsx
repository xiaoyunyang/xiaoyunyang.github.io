var SideNav = React.createClass({
  componentDidMount: function() {
    $('.collapsible').collapsible({
      accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
  },
  render: function () {
    return (
      <div className="perm side-nav fixed">
        <ul className="collection with-header">
            <li className="collection-header">
              <a href="#" id="user-info">{this.props.profileName}</a>
            </li>
        </ul>
        <ul className="collapsible" data-collapsible="expandable">
          <SideBinders binders={this.props.binders}/>
          <SideTags tags={this.props.tags}/>
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
