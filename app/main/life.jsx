var Life = React.createClass({
  render: function() {
    return (
      <div>
        <div className="col s12 m8 l8">
        <h4>Life</h4>
          <ul className="collection with-header ll-listing">
            <li className="collection-item"><a href="#map">Cost of Living</a>
              <p>
                This Geo Visualization shows how much does it cost to live in the United States. The Data is taken from the
                monthly Basic Allowance for Housing (BAH) for new recruits in the military.</p>
            </li>
            <li className="collection-item">
              <a href="#pie">
                A breakdown of a military officer's monthly salary
              </a>
              <p>
                 This pie chart visualization provides an overview of the different sources of money that compose my monthly salary.
              </p>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});
