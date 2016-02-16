var Writing = React.createClass({
  componentDidMount: function() {
    $('.materialboxed').materialbox();
  },
  render: function() {
    return (
      <div>
        <div className="col s12 m8 l12">
          <h4>Bad English Diary</h4>
          <img className="materialboxed" data-caption="My First diary entry when I spoke bad english" width="250" src="../../assets/img/badEnglishDiary/2002-10-29.JPG" />
        </div>
      </div>
    );
  }
});
ReactDOM.render(<Writing/>, document.getElementById('writing'));