
conf = {
	roots: [0, 10, 20, 30],
	cycleTime: 80,
	threshold: 0,
	verticeProbability: 0.8,
	rootProbability: 0.5,
	activeEdgesLimit: 1,
	edgeConf: {
	  meanActivityTime: 1,
	  activityTimeDeviation: 0.5
	},
	layersConf: {
	  activeLayers: ['NeuralNetLayer', 'SignalLayer'],
	  existingLayers: ['NeuralNetLayer', 'SignalLayer', 'RandomLayer'],
	},
	signalLayerConf: {
	  meanActivityTime: 1,
	  activityTimeDeviation: 0.5,
	  probabilityToActivate: 0.8
	},
	randomLayerConf: {
	  meanActivityTime: 1,
	  activityTimeDeviation: 0.5,
	  probabilityToActivate: 0.5
	}
};


// returns true if the browser should display the web-server's states
function isWebserver() {
    return true;//(typeof io != 'undefined');
}