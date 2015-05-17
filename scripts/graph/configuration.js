
conf = {
	roots: [0, 10, 20, 30],
	cycleTime: 80,
	threshold: 0,
	verticeProbability: 0.8, // move to NeuralNetLayerConf
	rootProbability: 0.5,  // move to NeuralNetLayerConf
	activeEdgesLimit: 1, // move to NeuralNetLayerConf
	edgeConf: {
	  meanActivityTime: 1,
	  activityTimeDeviation: 0.5
	},
	layersConf: {
	  activeLayers: ['OrgasmLayer', 'SignalLayer'],
	  existingLayers: ['NeuralNetLayer', 'SignalLayer', 'RandomLayer', 'OrgasmLayer'],
	},
	NeuralNetLayerConf: {
	  meanActivityTime: 1,
	  activityTimeDeviation: 0.5,
	  probabilityToActivate: 0.8
	},
	signalLayerConf: {
	  meanActivityTime: 1,
	  activityTimeDeviation: 0.5,
	  probabilityToActivate: 0.8
	},
	randomLayerConf: {
	  meanActivityTime: 2,
	  activityTimeDeviation: 1,
	  probabilityToActivate: 0.3
	},
	OrgasmLayerConf: {
	  meanActivityTime: 2,
	  activityTimeDeviation: 0.1,
	  distance: 5
	}
};


// returns true if the browser should display the web-server's states
function isWebserver() {
    return false;//(typeof io != 'undefined');
}