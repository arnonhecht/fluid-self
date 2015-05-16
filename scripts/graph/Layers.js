
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
    updateRoots: function(netState) {
        var updateMyRoot = function (l) {
            l.updateRoot(netState);
        };
        _.each(this.getActiveLayers(), updateMyRoot);
    },

    checkAndSetParams: function(conf) {
        _.each(this.layers, function(l) {
            if (l.checkAndSetParams) {
                l.checkAndSetParams(conf);
            }
        });
        _.extend(this, conf.layersConf);
    },

    // Public Functions
	// For each layer determine if the current vertice is active with regards to the layer
    determineCurrentState:function (theScoreToAdd)  {
        this.callActiveLayers('determineCurrentState');
    },

    // For each layer determine if the current vertice has an effect on its neighbours and what that effect is
    determineNetworkEffect:function (theScoreToAdd)  {
        this.callActiveLayers('determineNetworkEffect');
    },

    // For each layer causes the network effect based on the results of 'determineNetworkEffect' 
    causeNetworkEffect:function (theScoreToAdd)  {
        this.callActiveLayers('causeNetworkEffect');
    },

    // For each layer perform any operation to prepare for the next cycle
    prepareForNextState:function (theScoreToAdd)  {
        this.callActiveLayers('prepareForNextState');
    },

    resetRoots: function(rootStatus) {
        _.each(this.getActiveLayers(), function(l) {
            if (l.resetRoot) {
                l.resetRoot(rootStatus);
            }
        });
    },
    getActiveLayers: function() {
        return _.filter(this.layers, function(l) {
            return (_.contains(this.activeLayers, l.id));
        }.bind(this));
    },

    //private
    callActiveLayers: function(method) {
        _.each(this.getActiveLayers(), function(l) {
            if (l[method]) {
                l[method]();
            }
        });
    }
};
