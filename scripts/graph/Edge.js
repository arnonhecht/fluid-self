function Edge (params) {
    _.extend(this, params);
    this.active = false;
    this.isDirty = false;
};

Edge.prototype = {
  constructor: Vertice,

  // Private Functions
  meanActivityTime: 1,
  activityTimeDeviation: 0.5,


  // Public Functions
  checkAndSetParams: function(conf) {

  },
  resetRoots: function(rootStatus) {

  },
  updateRoots: function() {

  },
  determineCurrentState: function() {

  },
  determineNetworkEffect: function() {
    if (this.isActive() && this.isDone()) {
      this.deactivate();
    }
  },
  causeNetworkEffect: function () {

  },
  prepareForNextState: function() {

  },

  // API for external Coonsumer
  activate: function() {
    if (!this.active && !this.isDirty) { // we do not want to reactivate it into eternity
      this.active = true;
      this.isDirty = true;
      var sign = (0.5<Math.random()) ? 1: (-1);
      var activityTime = (this.meanActivityTime + (sign * this.activityTimeDeviation * Math.random())) * 1000;
      console.log('Edge ('+this.originEdge.source+','+this.originEdge.target+') activity time: ' + activityTime/1000 + ' seconds');
      this.ts = (new Date().getTime() + activityTime);
    }
  },
  deactivate: function() {
    this.active = false;
  },
  setPristine: function() {
    this.isDirty = false;
  },

  isDone: function(state) {
    return (this.ts < new Date().getTime());
  },
  isActive: function() {
    return this.active && this.isDirty;
  },
  wasActive: function() {
    return (!this.active && this.isDirty);
  },
  isSignaling: function() {

  },
};		




