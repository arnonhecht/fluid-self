
function buildFLuideSelfNetwork(graph, modules) {
	var getGraphVertice = function(idx, coordinates) {
		var verticeRepresenation = {"name":"[" + (idx-1) + "]","group":(idx-1), "coordinates":coordinates};
		return [verticeRepresenation];
	};

	var getE = function(from, to) {
		return {"source":(from-1),"target":(to-1),"value":1, "color": 'blue'}
	};




	// var graph = networkDef;
	// validate edges are correct
	_.each(graph.edges, function(edgeA){
		var result = _.union(_.where(graph.edges, {s:edgeA.s, t:edgeA.t}), _.where(graph.edges, {s:edgeA.t, t:edgeA.s}));

		if (result.length!=1) {
			throw("Bad network!!! Duplicate edge: (" + edgeA.s + "," + edgeA.t+ ")")
		}
	});


	var verticesRepresentation = [];
	_.each(graph.vertices, function(v) {
		verticesRepresentation = verticesRepresentation.concat(getGraphVertice(v.id, v.v));
	});


	var edgesRepresentation = [];
	_.each(graph.edges, function(obj) {
		edgesRepresentation.push(getE(obj.s, obj.t));
	});

	var netRepresentation = {
		vertices: verticesRepresentation,
		edges: edgesRepresentation
	};

	var makeNet = function(netStruct, roots) {
		// Init the Net 
		myNet = new Net(netStruct, roots, modules);

		// After the Net is setup init all of the external Modules:
		_.each(modules, function(module) {
			// Deep copy
			// var newObject = jQuery.extend(true, {}, oldObject);
			module.init(netStruct);
		}.bind(this));

		return myNet;
	};
	globalNetObject = makeNet(netRepresentation, conf.roots);


	console.log('Net representation is ready');
	return globalNetObject;
}

