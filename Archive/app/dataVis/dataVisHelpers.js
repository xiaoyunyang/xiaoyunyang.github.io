//anonymous function
const dvh = {}
dvh.objKey = function(d, i) {return Object.keys(d)[i];};
dvh.objVal = function(d, i) {return d[dvh.objKey(d,i)];};

dvh.tags = function(data) {
  return _.unique(data.map(function(d) {
    return dvh.objVal(d,0);
  }));
};
dvh.media = function(data) {
  return _.unique(data.map(function(d) {
    return dvh.objVal(d,1);
  }));
};
dvh.values = function(data) {
  return data.map(function(d) {
    return dvh.objVal(d,2);
  });
};

dvh.key = function(d) {return d.data.label;};

dvh.id = function(d) {return d;}
