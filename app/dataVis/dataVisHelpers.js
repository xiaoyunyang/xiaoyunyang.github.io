//anonymous function
const dvh = {}
dvh.objKey = (d, i) => Object.keys(d)[i];
dvh.objVal = (d, i) => d[dvh.objKey(d,i)];

dvh.tags = data => _.unique(data.map(d => dvh.objVal(d,0)));
dvh.media = data => _.unique(data.map(d => dvh.objVal(d,1)));
dvh.values = data => data.map(d => dvh.objVal(d,2));

dvh.key = d => d.data.label;
