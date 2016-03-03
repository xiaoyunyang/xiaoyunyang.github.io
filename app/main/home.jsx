var Home = React.createClass({
  render: function() {
    return (
      <div>
        <div className="col s12 m8 l8">
        <h4>Latest Projects</h4>
          <ul className="collection with-header ll-listing">
            <li className="collection-item"><a href="#map">Cost of Living</a>
              <p>
                This Geo Visualization shows how much does it cost to live in the United States. The Data is taken from the
                monthly Basic Allowance for Housing (BAH) for new recruits in the military.
              </p>
            </li>
            <li className="collection-item"><a href="#writing">Bad English Diary</a>
              <p>
                A book about how one girl who immigrated to the U.S. with no prior English skills learned English by keeping a diary written in Bad English.
                The book transcribes the diary entries with corrections for how to write it in proper English instead.
              </p>
            </li>
            <li className="collection-item">
              <a target="_blank" href="https://medium.com/@xiaoyunyang/10-best-things-i-did-before-i-turned-25-5511d23b726d#.4aax6w78m">
                10 Best Things I did before I turned 25.
              </a>
              <p>
                 An article I wrote for Medium (published 2/24/16), in which I reflect on all the things I accomplished before the age of 25.
              </p>
            </li>
            <li className="collection-item">
              <a href="#pie">
                A breakdown of a military officer's monthly salary
              </a>
              <p>
                 This pie chart visualization provides an overview of the different sources of money that compose my monthly salary.
              </p>
            </li>
            <li className="collection-item">
              <a target="_blank" href="presentation.html">
                Interactive Data Presentation
              </a>
              <p>
                 A presentation on how data visualization can be used for better story telling and decision making.
              </p>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});
ReactDOM.render(<Home/>, document.getElementById('home'));
