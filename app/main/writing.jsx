var MdText = React.createClass({
  loadMdData: function() {
    $.ajax({
      url: this.props.url,
      success: function(data) {
        this.setState({
          mdData: data
        })
        console.log(data);
        html_content = marked( data );
        document.getElementById('text').innerHTML = html_content;
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
      <div id="text">
        {this.mdData}
      </div>
    );
  }
});

var Writing = React.createClass({
  componentDidMount: function() {
    $('.materialboxed').materialbox();
  },
  render: function() {
    return (
      <div>
        <div className="col s12 m8 l12">
          <MdText url="assets/md/BED.md" />
        </div>
        <div className="col s12 m8 l4">

          <ul className="collapsible popout" data-collapsible="accordion">
            <li>
              <div className="collapsible-header"><i className="material-icons">filter_drama</i>10/28/2012</div>
              <div className="collapsible-body">
                <img className="materialboxed" data-caption="My First diary entry when I spoke bad english" width="250" src="assets/img/badEnglishDiary/2002-10-29.JPG" />
              </div>
            </li>

          </ul>
      </div>
      </div>
    );
  }
});
ReactDOM.render(<Writing/>, document.getElementById('writing'));
