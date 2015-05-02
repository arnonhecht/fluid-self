
function Layers (verticeRef, layersParams) {
	var getLayer = function(layerParam) {
		return new layerParam.layerCtor(verticeRef, layerParam.ctorParams);
	};
	this.layers = _.map(layersParams, getLayer);
}

Layers.prototype = {
    // constructor: SignalLayer,
    constructor: Layers,

    //  Private Functions
    getLayer: function(id) {
		return _.findWhere(this.layers, {id: id});
    },
    updateRoots: function() {
        var updateMyRoot = function (l) {
            l.updateRoot();
        };
        _.each(this.layers, updateMyRoot);
    },

    checkAndSetParams: function(conf) {
        _.each(this.layers, function(l) {
            if (l.checkAndSetParams) {
                l.checkAndSetParams(conf);
            }
        });
    },

    // Public Functions
	// For each layer determine if the current vertice is active with regards to the layer
    determineCurrentState:function (theScoreToAdd)  {
    	var determineCurrentState = function (l) {
    		l.determineCurrentState();
    	};
        _.each(this.layers, determineCurrentState);
    },

    // For each layer determine if the current vertice has an effect on its neighbours and what that effect is
    determineNetworkEffect:function (theScoreToAdd)  {
    	var determineNetworkEffect = function (l)  {
    		l.determineNetworkEffect();
    	};
        _.each(this.layers, determineNetworkEffect);
    },

    // For each layer causes the network effect based on the results of 'determineNetworkEffect' 
    causeNetworkEffect:function (theScoreToAdd)  {
    	var causeNetworkEffect = function (l)  {
    		l.causeNetworkEffect();
    	};
        _.each(this.layers, causeNetworkEffect);
    },

    // For each layer perform any operation to prepare for the next cycle
    prepareForNextState:function (theScoreToAdd)  {
    	var prepareForNextState = function  (l) {
    		l.prepareForNextState();
    	};
        _.each(this.layers, prepareForNextState);
    },

    resetRoots: function(rootStatus) {
        _.each(this.layers, function(l) {
            if (l.resetRoot) {
                l.resetRoot(rootStatus);
            }
        });
    }
};
