var barColor = "#00b0ff";

/*** Inc Slider ***/
var IncSlider = {};
IncSlider.val = 0;
var numDataPoints = 10;
var incDatasetInit = [];

for(var i=0; i< numDataPoints; i++) {
  incDatasetInit.push(0);
 }

var incDataset = incDatasetInit;
updateIncDataset();

IncSlider.w = document.getElementById("inc-slider-canvas").clientWidth; 
IncSlider.h = IncSlider.w/10;
var padding = IncSlider.w/100;
var barPadding = 1;
var svg = d3.select("#inc-slider-canvas").append("svg").attr("width", IncSlider.w).attr("height", IncSlider.h);
svg.selectAll("rect")
   .data(incDataset)
   .enter()
   .append("rect");
fixIncSlider();

function updateIncDataset() {
  for(var i=0; i< numDataPoints; i++) {
    if( i<IncSlider.val) {
        incDataset[i]=1;    
    } else {
        incDataset[i]=0; 
    }
  }
}
function fixIncSlider() {
  padding = IncSlider.w/100;
  d3.select("#inc-slider-canvas").selectAll("rect")
     .attr("x", function(d, i){
        return i * (IncSlider.w/incDataset.length)-padding/2;
      })
     .attr("y", function(d) {
        return 0;
      })
     .attr("height", function(d) {
        return d*(IncSlider.h-padding);
      })
    .attr("width", function(d) {
        return (IncSlider.w-2*padding)/incDataset.length-2*barPadding;
     })
    .attr("fill", function(d) { return barColor; });
}
function updateIncSlider() {
  updateIncDataset();
  d3.select("#inc-slider-canvas").selectAll("rect")
     .data(incDataset)
     .attr("height", function(d) {
         return d*(IncSlider.h-padding);
      });
}   



/**** Range Slider ***/
var RangeSlider = {};
RangeSlider.min = 2;
RangeSlider.max = 8;
var datasetInit = [];
var numDataPoints = 10;
for(var i=0; i< numDataPoints; i++) {
  datasetInit.push(0);
 }
var dataset = datasetInit;
updateDataset();

RangeSlider.w = document.getElementById("range-slider-canvas").clientWidth; 
RangeSlider.h = RangeSlider.w/10;
var padding = RangeSlider.w/100;
var barPadding = 1;
var svg = d3.select("#range-slider-canvas").append("svg").attr("width", RangeSlider.w).attr("height", RangeSlider.h);
svg.selectAll("rect")
   .data(dataset)
   .enter()
   .append("rect");
fixRangeSlider();

function updateDataset() {
  for(var i=0; i< numDataPoints; i++) {
    if(i>=RangeSlider.min && i<RangeSlider.max) {
        dataset[i]=1;    
    } else {
        dataset[i]=0; 
    }
  }
}

function fixRangeSlider() {
  padding = RangeSlider.w/100;
  d3.select("#range-slider-canvas").selectAll("rect")
     .attr("x", function(d, i){
        return i * (RangeSlider.w/dataset.length)-padding/2;
      })
     .attr("y", function(d) {
        return 0;
      })
     .attr("height", function(d) {
        return d*(RangeSlider.h-padding);
      })
    .attr("width", function(d) {
        return (RangeSlider.w-2*padding)/dataset.length-2*barPadding;
     })
    .attr("fill", function(d) { return barColor; });
}
function updateRangeSlider() {
  updateDataset();
  d3.select("#range-slider-canvas").selectAll("rect")
     .data(dataset)
     .attr("height", function(d) {
         return d*(RangeSlider.h-padding);
      });
}   

$( window ).resize(function() {
  RangeSlider.w = document.getElementById("range-slider-canvas").clientWidth; 
  RangeSlider.h = RangeSlider.w/10;
  d3.select("#range-slider-canvas").attr("width", RangeSlider.w).attr("height", RangeSlider.h);
  fixRangeSlider();

  IncSlider.w = document.getElementById("inc-slider-canvas").clientWidth; 
  IncSlider.h = IncSlider.w/10;
  d3.select("#inc-slider-canvas").attr("width", IncSlider.w).attr("height", IncSlider.h);
  fixIncSlider();

});


var rangeSlider = document.getElementById('range-slider');
noUiSlider.create(rangeSlider, {
 start: [RangeSlider.min, RangeSlider.max],
 connect: true,
 step: 1,
 range: {
   'min': 0,
   'max': 10
 },
 pips: {
    mode: 'values',
    values: [0, 2, 4, 6, 8, 10],
    density: 10
  }
});
var rangeMin = document.getElementById('range-slider-min');
var rangeMax = document.getElementById('range-slider-max');
rangeSlider.noUiSlider.on('update', function ( values, handle ) {

  if ( handle ) {
      RangeSlider.max = values[handle];
      rangeMax.innerHTML = values[handle];
  } else {
      RangeSlider.min = values[handle];
      rangeMin.innerHTML = values[handle];
  }
  updateRangeSlider();
  checkAns();
  
});
var incSlider = document.getElementById('inc-slider');
noUiSlider.create(incSlider, {
  start: IncSlider.val,
  connect: 'lower',
  step: 1,
  range: {
      'min': 0,
      'max': 10
  }
});
var incVal = document.getElementById('inc-slider-val');
incSlider.noUiSlider.on('update', function ( values, handle ) {

  if ( handle ) {
      IncSlider.val = values[handle];
      incVal.innerHTML = values[handle];
  } else {
      IncSlider.val = values[handle];
      incVal.innerHTML = values[handle];
  }
  updateIncSlider();
  checkAns();
  
});

function checkAns() {
  if(RangeSlider.max - RangeSlider.min == IncSlider.val) {
    d3.select("#correct-ans").text("Correct!").style("color","#81c784"); 
  }else {
    d3.select("#correct-ans").text("Find the difference:").style("color","black"); 
  }
}
