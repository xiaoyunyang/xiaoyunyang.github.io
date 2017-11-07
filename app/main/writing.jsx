var Writing = React.createClass({
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
ReactDOM.render(<Writing/>, document.getElementById('writing'));
