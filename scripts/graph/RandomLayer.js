function RandomLayer (verticeRef, params) {
    _.extend(this, params);
    this.currColor = params.currColor;
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
        if (this.verticeRef.id==0 && this.isDone()) {// this layer should only run once
            this.setLayerTimeout()
            _.each(this.netStruct.edges, function(e){
                var currEdgeRef = e.edgeRef;
                if (currEdgeRef.wasActive()) {
                  currEdgeRef.setPristine();
                }
                if (Math.random() < this.probabilityToActivate) {
                    currEdgeRef.activate();
                } else {
                    currEdgeRef.deactivate();
                }
            }.bind(this));
        }
    },

    // Layer Specific Methods
    setLayerTimeout: function() {
        var sign = (0.5<Math.random()) ? 1: (-1);
        var activityTime = parseInt((this.meanActivityTime + (sign * this.activityTimeDeviation * Math.random())) * 1000);
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
