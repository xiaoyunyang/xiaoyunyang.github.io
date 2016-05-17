var Pie = React.createClass({

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
        <h4>Piechart DataVis:</h4>
        <p>Click <a href="piechart/pie-collection.html">HERE</a> for template</p>
        <h5>2016 Officer Monthly Income Breakdown</h5>
        <p>The BAH rate is based on DC metro O2 without dependents.
          Source: <a target="_blank" href="http://www.stripes.com/polopoly_fs/1.384271.1450203758!/menu/standard/file/2016%20%20BAH%20Rates.pdf">2016 BAH Rate </a>
        and <a target="_blank" href="http://www.dfas.mil/militarymembers/payentitlements/military-pay-charts.html">Military Pay Charts By Year</a>
      </p>
      </div>
      <div className="col s12 l8">
        <div id="pie-chart"></div>
      </div>
      <div className="col s12 m8 l2">
        <div id="pie-chart-desc"></div>
      </div>
    </div>
    );
  }
});
ReactDOM.render(<Pie/>, document.getElementById('pie'));
