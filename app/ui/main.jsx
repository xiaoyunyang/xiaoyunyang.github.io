var Main = React.createClass({
  componentDidMount: function(){
    $('.tooltipped').tooltip({delay: 50});
  },
  render: function() {
    return (
      <div className="main-content row">
        <div className="col s12 m8 l10">
          <div id="home-page" className="pages">The Home Page</div>
          <div id="life-page" className="pages">The life page</div>
          <div id="map-page" className="pages">
            <h4>Monthly Cost of Living (/Mo)</h4>
            <div id="tooltip"></div>
            <svg width="960" height="600" id="statesvg"></svg>
          </div>
          <div id="hack-page" className="pages">The Hack Page</div>
          <div id="about-page" className="pages">The about page</div>
          <div id="contact-page" className="pages">The Contact Page</div>
        </div>

        <div className="col s12 m8 l2">
          <h5>Similar Curators</h5>
          <ul id="slide-out" className="collapsible" data-collapsible="expandable">
            <li>
              <div className="collapsible-header"><a href="">xyang</a><i className="material-icons right">keyboard_arrow_down</i></div>

              <div className="collapsible-body"> <p>Because you both collected #tag1 and #tag2</p></div>
            </li>
            <li>
              <div className="collapsible-header"><a href="">kbusch</a><i className="material-icons right">loyalty</i></div>
              <div className="collapsible-body"> <p>Because you both collected #tag2</p></div>
            </li>
          </ul>
          <h5>Tags wordcloud</h5>
        </div>
      </div>
    );
  }
});
ReactDOM.render(<Main/>, document.getElementById('main'));
