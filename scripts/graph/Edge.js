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
  activate: function(time) {
    console.log("Trying to activate : " +this.originEdge.source + ", " + this.originEdge.target);
    if (!this.active && !this.isDirty) { // we do not want to reactivate it into eternity
      console.log("activated: " +this.originEdge.source + ", " + this.originEdge.target);
      this.setAcivationParams(time);
    }
  },
  setAcivationParams: function(activityTime) {
      this.active = true;
      this.isDirty = true;
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
  setActiveByTouch: function(time) {
    this.activeByTouch = true;
    this.setAcivationParams(time);
  },

  log: false
};    




