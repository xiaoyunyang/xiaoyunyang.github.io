var Writing = React.createClass({
  render: function() {
    return (
      <div>
        <h4>My Writing</h4>
        <div className="col s12 m10 l10">
          <MdText url={this.props.mdUrl} textId="text-writing" />
        </div>
      </div>
    );
  }
});
ReactDOM.render(<Writing/>, document.getElementById('writing'));
