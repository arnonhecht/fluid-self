function OrgasmLayer (verticeRef, params) {
    _.extend(this, params);
    this.verticeRef = verticeRef;

    this.active = (this.verticeRef.id==0);
    this.ts = 0;
};

OrgasmLayer.prototype = {
    constructor: OrgasmLayer,


    // Public layer interface to implement
    updateRoot: function() {
    },

    determineCurrentState: function (theScoreToAdd)  {
        // If the layer is done with the cycle trigger a new cycle
        if (this.verticeRef.id==0 && this.isDone()) {// this layer should only run once
            this.setLayerTimeout();
            this.activateOutgoingVertices(this.getRandomVertice(), this.distance);
        }
        // deactivate edges that are done to keep the system alive a bit
        this.updateEdgesState();  
    },

    // Layer Specific Methods
    setLayerTimeout: function() {
        var activityTime = (this.meanActivityTime + 3*this.activityTimeDeviation)*1000; //getRandomTime(this.meanActivityTime, this.activityTimeDeviation);
        this.ts = (new Date().getTime() + activityTime);
        this.activityDuration = activityTime;
    },

    isDone: function(state) {
        return (this.ts < new Date().getTime());
    },
    isActive: function() {
        return this.active;
    },
    getRandomVertice: function() {
        var vertices = this.netStruct.vertices;
        var r = Math.round(Math.random() * vertices.length);
        // debug: return [_.find(vertices, function(v){
        //     return v.verticeRef.id==14
        // })]
        for (i=0; i<vertices.length; i++) {
            if (r<i) return [vertices[i]];
        }
    },
    activateOutgoingVertices: function(verticeArr, currDistance) {
        if (currDistance<0) return;
        var activationMeanTime = (this.meanActivityTime * (currDistance/this.distance));
        var outgoingEdges = [];
        _.each(verticeArr, function(v) {
            outgoingEdges = _.union(_.union(outgoingEdges, v.verticeRef.outEdges), v.verticeRef.inEdges);
        });
        var outgoingVertices = [];
        _.each(outgoingEdges, function(e) {
            var outVertice = _.filter(this.netStruct.vertices, function(v) {
                return (v.verticeRef.id == e.target || v.verticeRef.id == e.source);
            });
            if (0<outVertice.length) {
                outgoingVertices = _.union(outgoingVertices, outVertice);
            }
            e.edgeRef.activate(getRandomTime((activationMeanTime), this.activityTimeDeviation));
        }.bind(this));
        setTimeout(function(){
            // console.log("activationMeanTime: " +activationMeanTime);
            this.activateOutgoingVertices(outgoingVertices, currDistance-1);
        }.bind(this), (this.meanActivityTime/this.distance) * 1000);
    },
    updateEdgesState: function() {
        _.each(this.netStruct.edges, function(e){
            var currEdgeRef = e.edgeRef;
            if (currEdgeRef.wasActive()) {
              currEdgeRef.setPristine();
              currEdgeRef.deactivate();
            }
        }.bind(this));
    }
};
