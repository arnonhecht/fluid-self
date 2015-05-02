
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
    return (this.active && this.finishedActive);
  },


    // Layer Specific Methods
	updateScore: function (theScoreToAdd)  {
	  this.currScore += theScoreToAdd;
	  // this.layers
	  this.verticeRef.d3Obj.name = this.verticeRef.name + "(" + this.currScore + ")";
	  return false;
	},

  isActive: function() {
    return (this.active && !this.finishedActive);
  },



  checkAndSetParams: function(conf) {
    this.threshold = conf.threshold;
    this.verticeProbability = conf.verticeProbability;
  },

	  // Public Functions
    getOutgoingVertices: function() {
      return this.outgoingVertices;
    },

    resetRoot: function(val) {
      this.isRoot = val;
    },


    // Public layer interface to implement
  	updateRoot: function() {
  		if (this.isRoot) {
  			this.updateScore(1);
  		}
  	},

    determineCurrentState:function (theScoreToAdd)  {
      if (this.active && !this.finishedActive) {
        this.finishedActive = true;
      } else {
  		  this.active = false;
  	    if (this.threshold < this.currScore) {
  	    	this.currScore = this.initScore;
  	    	this.active = true;
          this.finishedActive = false;
  	    }
      }
    },

    determineNetworkEffect:function (theScoreToAdd)  {
 		_.each(this.verticeRef.outVertices, function(v) {
       		if (this.isSignalOut(this.verticeProbability) && this.wasActive()) {
       			this.outgoingVertices.push(v);
       		} 
        }.bind(this));
    },

    causeNetworkEffect:function (theScoreToAdd)  {
       	_.each(this.outgoingVertices, function(v) {
       			v.layers.getLayer('NeuralNetLayer').updateScore(1);
       }.bind(this));
    },

    prepareForNextState:function (theScoreToAdd)  {
        this.outgoingVertices.length = 0;
    },

};

