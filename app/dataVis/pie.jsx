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
      <div className="col s12 m8 l8">
        <div id="pie-chart"></div>
      </div>
      <div className="col s12 m8 l2">
        <h5>2016 Officer Monthly Income Breakdown</h5>
        <p>The BAH rate is based on DC metro O2 without dependents.
          Source: <a target="_blank" href="http://www.stripes.com/polopoly_fs/1.384271.1450203758!/menu/standard/file/2016%20%20BAH%20Rates.pdf">2016 BAH Rate</a>
        </p>
      </div>
    </div>
    );
  }
});
ReactDOM.render(<Pie/>, document.getElementById('pie'));
