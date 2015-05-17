function SignalLayer (verticeRef, params) {
    _.extend(this, params);
    this.currColor = params.currColor;
    this.verticeRef = verticeRef;

    this.active = false;
};

SignalLayer.prototype = {
    constructor: SignalLayer,


    // Public layer interface to implement
    updateRoot: function() {
    },

    determineCurrentState: function (theScoreToAdd)  {
    },

    determineNetworkEffect: function (theScoreToAdd)  {
        if (this.active && this.isDone()) {
            this.active = false;
            var verticePool = _.union(this.verticeRef.outEdges, this.verticeRef.inEdges);
            _.each(verticePool, function(edge) {
                var activityTime = getRandomTime(this.meanActivityTime, this.activityTimeDeviation);
                edge.edgeRef.setActiveByTouch(activityTime);
                if (Math.random() < this.probabilityToActivate && edge.target != this.verticeRef.id) {
                    _.findWhere(this.verticeRef.outVertices, {id: edge.target}).triggerSignal();
                }
            }.bind(this));
        }
    },

    causeNetworkEffect: function (theScoreToAdd)  {
    },

    prepareForNextState: function (theScoreToAdd)  {
    },



    // Layer Specific Methods
    triggerSignal: function() {
        this.active = true;
        var sign = (0.5<Math.random()) ? 1: (-1);
        var activityTime = parseInt((this.meanActivityTime + (sign * this.activityTimeDeviation * Math.random())) * 1000);
        this.ts = (new Date().getTime() + activityTime);
        this.activityDuration = activityTime;
        console.log("Signal Trigered for node id:" + this.verticeRef.id);
        // setTimeout(this.resetTimeoutPassed.bind(this), 1000);
    },

    isDone: function(state) {
        return (this.ts < new Date().getTime());
    },
    isActive: function() {
        return this.active;
    }
};
