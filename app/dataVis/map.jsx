var Map = React.createClass({
  getInitialState: function() {
    return {
      mapData
    }
  },
  componentWillMount: function() {
    d3.csv("assets/data/usmap/2016e1nodep.csv", function(error, data) {
      if(error) {
          console.log(error);
      } else {
          this.mapData = toJson(data);
          uStates.draw("#statesvg", this.mapData, tooltipHtml);
      }
    });
  },
  componentDidMount: function(){
    $('.tooltipped').tooltip({delay: 50});
  },
  render: function() {
    return (
    <div>

      <div className="col s12 m8 l6">
        <h5>Monthly Cost of Living ($/Mo)</h5>
        <p>The cost of living by state based on BAH rate for new recruits in the military
          Source: <a target="_blank" href="http://www.stripes.com/polopoly_fs/1.384271.1450203758!/menu/standard/file/2016%20%20BAH%20Rates.pdf">2016 BAH Rate</a> for E1 with no dependent
        </p>
      </div>
      <div className="col s12 m8 l6">
        <div id="state-cost-detail"></div>
      </div>
      <div className="col s12 m8 l10">
        <div id="tooltip"></div>
        <svg width="960" height="600" id="statesvg"></svg>
      </div>
    </div>
    );
  }
});
ReactDOM.render(<Map/>, document.getElementById('map'));

function toJson(bahData) {
  var mapData ={};
  var arr = []
  bahData.forEach(function(d,i){
    mapData[d.state]={
      low:bahData[i].low,
      high:bahData[i].high,
      avg:bahData[i].avg,
      color: d3.interpolate("#ffffcc", "#800026")(bahData[i].high/2000)
    };
  });
  return mapData;
}

function tooltipHtml(n, d){ /* function to create html content string in tooltip div. */
  return "<h4>"+n+"</h4><table>"+
    "<tr><td>Low</td><td>"+("$"+d.low)+"</td></tr>"+
    "<tr><td>Average</td><td>"+("$"+d.avg)+"</td></tr>"+
    "<tr><td>High</td><td>"+("$"+d.high)+"</td></tr>"+
    "</table>";
}
