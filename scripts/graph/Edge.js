function Edge (params) {
    _.extend(this, params);
    this.active = false;
    this.activeByTouch = false;
    this.isDirty = false;
};

Edge.prototype = {
  constructor: Vertice,

  // Private Functions


  // Public Functionsa
  checkAndSetParams: function(conf) {
    _.each(conf, function(val, key) {
      this[key] = val;
    }.bind(this));
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
      this.setAcivationParams();
    }
  },
  setAcivationParams: function() {
      this.active = true;
      this.isDirty = true;
      var sign = (0.5<Math.random()) ? 1: (-1);
      var activityTime = parseInt((this.meanActivityTime + (sign * this.activityTimeDeviation * Math.random())) * 1000);
      if (this.log) console.log('Edge ('+this.originEdge.source+','+this.originEdge.target+') activity time: ' + activityTime/1000 + ' seconds');
      this.ts = (new Date().getTime() + activityTime);
      this.activityDuration = activityTime;
  },
  deactivate: function() {
    this.active = false;
    this.activeByTouch = false;
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
  getActivityDuration: function() {
    return this.activityDuration;
  },
  isSignaling: function() {

  },
  isActiveByTouch: function(){
    return this.activeByTouch;
  },
  setActiveByTouch: function() {
    this.activeByTouch = true;
    this.setAcivationParams();
  },

  log: false
};    




