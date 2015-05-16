
function NeuralNetLayer (verticeRef, params) {
	// var me = this;
    this.id = params.id;
    this.activeColor = 'yellow'
    this.verticeRef = verticeRef;

    this.active = false;
    this.finishedActive = true;
    // todo: use _.extend !
    this.threshold = params.threshold;
    this.initScore = params.initScore;
    this.currScore = params.initScore;
    this.rootProbability = params.rootProbability;
    this.activeEdgesLimit = params.activeEdgesLimit;
    this.verticeProbability = params.verticeProbability;
    this.isRoot = _.contains(params.roots, this.verticeRef.id);


    this.outgoingVertices = [];
};


NeuralNetLayer.prototype = {
  constructor: NeuralNetLayer,

	// Private Functions
	isSignalOut: function(w) {
		return (Math.random() < w);
	},

  wasActive: function() {
    return (!this.active && !this.finishedActive);
  },


    // Layer Specific Methods
	updateScore: function (theScoreToAdd)  {
	  this.currScore += theScoreToAdd;
	  return false;
	},

  isActive: function() {
    return (this.active && !this.finishedActive);
  },



  checkAndSetParams: function(conf) {
    this.threshold = conf.threshold;
    this.verticeProbability = conf.verticeProbability;
    this.activeEdgesLimit = conf.activeEdgesLimit;
  },

  // Public Functions
  getOutgoingVertices: function() {
    return this.outgoingVertices;
  },

  resetRoot: function(val) {
    this.isRoot = val;
  },


  // Public layer interface to implement
	updateRoot: function(netState) {
		if (this.isRoot && netState.numActiveEdges < this.activeEdgesLimit && this.rootProbability < Math.random()) {
			this.updateScore(1);
		}
	},

  determineCurrentState: function (theScoreToAdd)  {
    if (this.isActive()) {
      this.active = false;
    } else if (this.wasActive()) {
      this.finishedActive = true;
    } else {
	    if (this.threshold < this.currScore) {
	    	this.currScore = this.initScore;
	    	this.active = true;
        this.finishedActive = false;
	    }
    }
  },

  determineNetworkEffect:function (theScoreToAdd)  {
		_.each(this.verticeRef.outVertices, function(v) {
        var currEdgeRef = this.verticeRef.getEdge(this.verticeRef.id, v.id).edgeRef;
     		if (this.wasActive() && this.isSignalOut(this.verticeProbability)) {
          currEdgeRef.activate();
     		} 
        if (currEdgeRef.wasActive()) {
          currEdgeRef.setPristine();
          this.outgoingVertices.push(v);
        }
      }.bind(this));
  },

  causeNetworkEffect:function (theScoreToAdd)  {
     	_.each(this.outgoingVertices, function(v) {
     			var verticeNetworkLayer = v.layers.getLayer('NeuralNetLayer');
          verticeNetworkLayer.updateScore.call(verticeNetworkLayer, 1)
     }.bind(this));
  },

  prepareForNextState:function (theScoreToAdd)  {
      this.outgoingVertices.length = 0;
  },

};

