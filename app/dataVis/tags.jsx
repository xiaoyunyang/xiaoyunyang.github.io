var Tags = React.createClass({
  tagClick: function(event) {
    this.props.tagClick(event);
  },
  render: function() {
    var activeTags = this.props.activeTags;
    return (
         <div>{
          this.props.tags.map(function(t,i) {
            if(t!="NULL" && _.contains(activeTags,t)) {
              return <a key={i} value={t} className="active" rel="tag" onClick={this.tagClick}>{t}</a>
            }else if(t!="NULL") {
              return <a key={i} value={t} rel="tag" onClick={this.tagClick}>{t}</a>
            }
          }.bind(this))
        }</div>
    );
  }
});
