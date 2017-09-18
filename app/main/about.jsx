var About = React.createClass({

  componentDidMount: function() {
    $('.materialboxed').materialbox();
    $('.slider').slider({full_width: true});
  },
  render: function() {
    return (
      <div>
        <h4>About Xiaoyun</h4>
        <div className="col s12 m10 l10 offset-l1 offset-m1">
          <MdText url={this.props.mdUrl} textId="text-about" />
        </div>
      </div>
    );
  }
});

var BookCard = React.createClass({
  render: function() {
    return (
      <div className="col l3 m3">
    		<div className="card">
    		<div className="card-image waves-effect waves-block waves-light">
      			<img className="activator" src={this.props.bookCover} />
    		</div>
    		<div className="card-content">
      			<span className="card-title activator grey-text text-darken-4"><i className="material-icons right">more_vert</i></span>
      			<p><a target="_blank" href={this.props.bookLink}>Read</a></p>
    		</div>
    		<div className="card-reveal">
      		<span className="card-title grey-text text-darken-4">{this.props.bookName}<i className="material-icons right">close</i></span>
     			<p>{this.props.bookDesc}</p>
    		</div>
      	</div>
      </div>
    );
  }
});
