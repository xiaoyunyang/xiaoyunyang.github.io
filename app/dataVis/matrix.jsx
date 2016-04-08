var Matrix = React.createClass({

  componentWillMount: function() {
    d3.csv("assets/data/piechart/income-O2.csv", function(error, data) {
      if(error) {
          console.log(error);
      } else {
          mountPieChart(data);
      }
    });
  },
  render: function() {
    return (
    <div>
      <div className="col s12 l10">
        <h5>Adjacency Matrix DataVis:
          <p>
            Click <a href="matrix/matrix.html">HERE</a> for template
          </p>

        </h5>

      </div>

    </div>
    );
  }
});
ReactDOM.render(<Matrix/>, document.getElementById('matrix'));
