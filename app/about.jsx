var About = React.createClass({

  componentDidMount: function() {
    $('.materialboxed').materialbox();
    $('.slider').slider({full_width: true});
  },
  render: function() {
    return (
      <div>
        <div className="col s12 m8 l12">
          <MdText url="/assets/md/about.md" textId="text-about" />
        </div>
      </div>
    );
  }
});

ReactDOM.render(<About/>, document.getElementById('landing-about'));
