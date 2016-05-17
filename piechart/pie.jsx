var Pie = React.createClass({
  pieVis: function(divId, visActiveData) {

    d3.select(divId).selectAll("svg").remove();
    var pieChart = new PieChart(divId, visActiveData);
    return pieChart;
  },
  componentWillMount: function() {
    d3.csv("income-O2.csv", function(error, data) {
      if(error) {
          console.log(error);
      } else {
          this.pieVis("#chart", data);
      }
    }.bind(this));
  },
  render: function() {
    return (
    <div>
      <div className="col s12 l10">
        <div id="chart"></div>
      </div>
    </div>
    );
  }
});
ReactDOM.render(<Pie/>, document.getElementById('pie'));
