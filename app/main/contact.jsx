var Contact = React.createClass({
  render: function() {
    return (
      <div>
        <div className="col s12 m8 l10">
          <h4>Do you have something you like me to visualize for you?</h4>
          <a href="mailto:xyang232@gmail.com?Subject=DataVis%20Request" className="waves-light btn-large">
            Send me DataViz request 
            <i className="material-icons right">send</i>
          </a>
        </div>
        <div className="col s12 m8 l2">Contact Page Side Bar</div>
      </div>
    );
  }
});
ReactDOM.render(<Contact/>, document.getElementById('contact'));