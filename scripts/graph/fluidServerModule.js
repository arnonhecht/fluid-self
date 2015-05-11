
var _moduleName = 'fluidServerModule';

fluidServerModule = function(api) {

	var me = this;
	me.name = _moduleName;

	me.api = api;
	
	me.init = function(netStruct) {
		// Callbacks for the Net 
		me.preCycleOps = function(netStruct) {
			var allVertices = [];
			_.each(netStruct.allVertices, function(v) {
				allVertices.push({
					id: (v.id + 1),
					active: (v.isActive() ? "true" : "false"),
					sensorActive: (v.isActiveByTouch() ? "true" : "false")
				});
			});

			var allEdges = [];
			_.each(netStruct.allEdges, function(e) {
				allEdges.push({
					source: (e.source + 1),
					target: (e.target + 1),
					active: (e.edgeRef.isActive() ? "true" : "false"),
					getActivityDuration: (e.edgeRef.isActive() ? e.edgeRef.getActivityDuration() : 0),
					sensorActive: (e.edgeRef.isActiveByTouch() ? "true" : "false")
				});
			});

			var netToSend = {
				allEdges: allEdges,
				allVertices: allVertices,
				networkDef: networkDef
			};

			var toSend = JSON.stringify(netToSend);
			// console.log("toSend: " + toSend);
			me.api.send(toSend); //me.api.write(toSend);
			
			_.each(netToSend.allVertices, function(v){
				if (v.sensorActive=="true") {
					console.log("Vertice '"+v.id+"' was touched")
				}
			})
	    };

	    me.externalActivationCallback = function(args) {
	    	if (!_.isEmpty(args.edge)) {
        		console.log('Vertice activation: ' + args);
        	} else if (!_.isEmpty(args.vertice)) {
    			console.log('Edge activation: ' + args);
        	}
	    };


	    me.tick = function () {

	    };
	};

	return me;
}

module.exports.fluidServerModule = fluidServerModule;