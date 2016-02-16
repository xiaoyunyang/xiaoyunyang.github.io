var Life = React.createClass({
  render: function() {
    return (
      <div>
        <div className="col s12 m8 l8">
        <h4>Life</h4>
          <ul className="collection with-header ll-listing">
            <li className="collection-item"><a href="#cost">Cost of Living</a>
              <p>
                This Geo Visualization shows how much does it cost to live in the United States. The Data is taken from the 
                monthly Basic Allowance for Housing (BAH) for new recruits in the military.</p>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});
ReactDOM.render(<Life/>, document.getElementById('life'));