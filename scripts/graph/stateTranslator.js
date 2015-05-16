var _moduleName = 'stateTranslator';

stateTranslator = (function(api) {

	var me = this;
	me.name = _moduleName;

	me.api = api;
	
	me.init = function(netStruct) {
	};

	me.translate = function(netStruct) {
			var allVertices = [];
			// var output = '';
			// for (var property in netStruct) {
			// 	if (typeof netStruct[property] != 'function')
			//   output += property + ': ' + netStruct[property]+'; ';
			// }
			// console.log(output);
			_.each(netStruct.netVertices, function(v) {
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
					wasActive: (e.edgeRef.wasActive() ? "true" : "false"),
					getActivityDuration: (e.edgeRef.isActive() ? e.edgeRef.getActivityDuration() : 0),
					sensorActive: (e.edgeRef.isActiveByTouch() ? "true" : "false")
				});
			});

			var netToSend = {
				allEdges: allEdges,
				allVertices: allVertices,
				networkDef: networkDef
			};
			return netToSend;
	};

	return me;
})();