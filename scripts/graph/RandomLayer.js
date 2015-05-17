function RandomLayer (verticeRef, params) {
    _.extend(this, params);
    this.verticeRef = verticeRef;

    this.active = (this.verticeRef.id==0);
    this.ts = 0;
};

RandomLayer.prototype = {
    constructor: RandomLayer,


    // Public layer interface to implement
    updateRoot: function() {
    },

    determineCurrentState: function (theScoreToAdd)  {
        // If the layer is done with the cycle trigger a new cycle
        if (this.verticeRef.id==0 && this.isDone()) {// this layer should only run once
            this.setLayerTimeout();
            _.each(this.netStruct.edges, function(e){
                var currEdgeRef = e.edgeRef;
                if (Math.random() < this.probabilityToActivate) {
                    var activityTime = getRandomTime(this.meanActivityTime, this.activityTimeDeviation);
                    currEdgeRef.activate(activityTime);
                } else {
                    currEdgeRef.deactivate();
                }
            }.bind(this));
        }
        // deactivate edges that are done to keep the system alive a bit
        _.each(this.netStruct.edges, function(e){
            var currEdgeRef = e.edgeRef;
            if (currEdgeRef.wasActive()) {
              currEdgeRef.setPristine();
            }
        }.bind(this));  
    },

    // Layer Specific Methods
    setLayerTimeout: function() {
        var sign = (0.5<Math.random()) ? 1: (-1);
        var activityTime = getRandomTime(this.meanActivityTime, this.activityTimeDeviation);
        this.ts = (new Date().getTime() + activityTime);
        this.activityDuration = activityTime;
    },

    isDone: function(state) {
        return (this.ts < new Date().getTime());
    },
    isActive: function() {
        return this.active;
    }
};
