
var _moduleName = 'fluidServerModule';

fluidServerModule = function(api) {

	var me = this;
	me.name = _moduleName;

	me.api = api;
	
	me.init = function(netStruct) {
		// Callbacks for the Net 
		me.preCycleOps = function(netStruct) {
			// console.log("e: "+netStruct.allEdges.length+", v: " + netStruct.allVertices.length);
			var netToSend = stateTranslator.translate(netStruct);
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