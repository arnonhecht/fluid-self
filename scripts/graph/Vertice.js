function Vertice (params) {
    _.extend(this, params);
    this.outVertices = [];
    this.inVertices = [];
    this.inEdges = [];
    this.outEdges = [];
    this.currScore = params.initScore;
    this.outgoingVertices = [];
    this.layers = new Layers(this, params.layers)
};

Vertice.prototype = {
  constructor: Vertice,

  // Private Functions
  


  // Public Functions
  checkAndSetParams: function(conf) {
    this.layers.checkAndSetParams(conf);
  },
  resetRoots: function(rootStatus) {
    this.layers.resetRoots(rootStatus);
  },
  updateRoots: function() {
    this.layers.updateRoots();
  },
  determineCurrentState: function() {
    this.layers.determineCurrentState();
  },
  determineNetworkEffect: function() {
       this.layers.determineNetworkEffect();
  },
  causeNetworkEffect: function () {
       this.layers.causeNetworkEffect();
  },
  prepareForNextState: function() {
      this.layers.prepareForNextState();
  },

  // API for external Coonsumer
  // right now a vertice is active if the 'NeuralNetLayer' is active - we can insert more logic but its ok for now
  isActive: function() {
    return this.layers.getLayer('NeuralNetLayer').isActive();
  },
  isSignaling: function() {
    return this.layers.getLayer('NeuralNetLayer').wasActive();
  },
};		




