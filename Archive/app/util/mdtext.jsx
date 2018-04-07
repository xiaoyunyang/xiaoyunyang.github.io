var MdText = React.createClass({
  loadMdData: function() {
    $.ajax({
      url: this.props.url,
      success: function(data) {
        this.setState({
          mdData: data
        })
        html_content = marked( data );
        document.getElementById(this.props.textId).innerHTML = html_content;
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })
  },
  getInitialState: function() {
    return {
      mdData: ''
    };
  },
  componentWillMount: function() {
    this.loadMdData();
    //console.log(mdData);
  },
  render: function() {
    return (
      <div id={this.props.textId}>
        {this.mdData}
      </div>
    );
  }
});
