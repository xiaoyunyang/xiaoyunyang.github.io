var Home = React.createClass({
  render: function() {
    return (
      <div>
        <div className="col s12 m8 l8">
        <h4>Latest Projects</h4>
          <ul className="collection with-header ll-listing">
            <li className="collection-item"><a href="#cost">Cost of Living</a>
              <p>
                This Geo Visualization shows how much does it cost to live in the United States. The Data is taken from the 
                monthly Basic Allowance for Housing (BAH) for new recruits in the military.
              </p>
            </li>
            <li className="collection-item"><a href="#cost">Bad English Diary</a>
              <p>
                A book about how one girl who immigrated to the U.S. with no prior English skills learned English by keeping a diary written in Bad English.
                The book transcribes the diary entries with corrections for how to write it in proper English instead.
              </p>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});
ReactDOM.render(<Home/>, document.getElementById('home'));