function SignalLayer (verticeRef, params) {
    this.id = params.id;
    this.activeColor = 'yellow'
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
        if (this.active) {
            this.currColor ='red'
        } else {
            this.currColor ='blue'
        }
    },

    determineNetworkEffect: function (theScoreToAdd)  {
        if (0<this.cyclesTillTimeout) {
            this.cyclesTillTimeout--;
        }
        if (this.active && 0==this.cyclesTillTimeout) {
            this.active = false;
            _.each(this.verticeRef.outEdges, function(edge) {
                edge.color = this.activeColor;
            }.bind(this));
            _.each(this.verticeRef.inEdges, function(edge) {
                edge.color = this.activeColor;
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
        this.cyclesTillTimeout = false;
        this.cyclesTillTimeout = 3;
        console.log("Signal Trigered for node id:" + this.verticeRef.id);
        // setTimeout(this.resetTimeoutPassed.bind(this), 1000);
    },

    isActive: function() {
        return this.active;
    }
};
