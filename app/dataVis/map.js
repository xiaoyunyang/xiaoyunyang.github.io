var bahData;
var mapData;

d3.csv("assets/data/usmap/2016e1nodep.csv", function(error, data) {
    if(error) {
        console.log(error);
    } else {
        bahData = data;
        mapData = toJson(bahData);
        uStates.draw("#statesvg", mapData, tooltipHtml);
    }
});
function toJson(bahData) {
  var mapData ={};
  var arr = []
  bahData.forEach(function(d,i){
    //arr.push(d.state);
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
    "<tr><td>Low</td><td>"+(d.low)+"</td></tr>"+
    "<tr><td>Average</td><td>"+(d.avg)+"</td></tr>"+
    "<tr><td>High</td><td>"+(d.high)+"</td></tr>"+
    "</table>";
}
