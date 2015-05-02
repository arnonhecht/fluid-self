
fluidServerModule = function(api) {

	var me = this;

	me.init = function(netStruct) {
		// Callbacks for the Net 
		me.preCycleOps = function(netStruct) {
			var allVertices = [];
			_.each(netStruct.allVertices, function(v) {
				allVertices.push({
					id: v.id,
					active: v.isActive()

				});
			});

			var allEdges = [];
			_.each(netStruct.allEdges, function(e) {
				allEdges.push({
					source: e.source,
					target: e.target,
					active: (0.5<Math.random())
				});
			});

			var toSend = {
				allEdges: allEdges,
				allVertices: allVertices
			}
			console.log("args: " + JSON.stringify(toSend));
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

module.exports = fluidServerModule;