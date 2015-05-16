function Net (netStruct, roots, modules) {

    this.threshold = conf.threshold;

    var getNetVertice = function(d3Vertice) {
        var params = {
            // name: d3Vertice.name,
            // id: d3Vertice.group,
            d3Obj: d3Vertice,
            confCache: conf, // in order to check if the configuration has changed
            layers: [{
                id: 'SignalLayer',
                layerCtor: SignalLayer,
                ctorParams: _.extend({
                    id: 'SignalLayer',
                }, conf.signalLayerConf)
            },{
                id: 'NeuralNetLayer',
                layerCtor: NeuralNetLayer,
                ctorParams: {
                    id: 'NeuralNetLayer',
                    threshold: conf.threshold,
                    verticeProbability: conf.verticeProbability, //0.5,
                    activeEdgesLimit: conf.activeEdgesLimit,
                    rootProbability: conf.rootProbability,
                    initScore: 0,
                    roots: roots //[0, 2, 14, 25, 33, 27, 21, 20, 22]
                }
            },{
                id: 'RandomLayer',
                layerCtor: RandomLayer,
                ctorParams: _.extend({
                    id: 'RandomLayer',
                    netStruct: netStruct
                }, conf.randomLayerConf)
            }]
        };

        params = _.extend(params, d3Vertice);
        params.id = params.group;
        params.group = undefined; // legacy from d3 - we don't want this
        var newVertice =  new Vertice(params);
        d3Vertice.verticeRef = newVertice;
        return newVertice;
    };
    console.log("netStruct.vertices:" + netStruct.vertices.length)
    this.netVertices  = _.map(netStruct.vertices, getNetVertice);
    this.netEdges = [];
    this.addEdges(netStruct.edges);

    callModule = function(method, args) {
        _.each(modules, function(m){
            m[method].call(undefined, args);
        });
    };

    this.externaltick = function(args){callModule('tick', args)};
    this.preCycleOps = function(args){callModule('preCycleOps', args)};
    this.externalActivationCallback = function(args){callModule('externalActivationCallback', args)};
};

Net.prototype = {
    constructor: Net,

    // Private Functions
    resetRoots: function(rootsList) {
        _.each(this.netVertices, function(v) {
            var rootStatus = _.contains(rootsList, v.id);
            v.resetRoots(rootStatus);
        })
    },
    addEdge: function(e) {
        var source = this.getV(e.source);
        var target = this.getV(e.target);
        source.outVertices.push(target);
        target.inVertices.push(source);

        source.outEdges.push(e);
        target.inEdges.push(e);

        this.netEdges.push(e);

        if (undefined==source.getEdge(e.source, e.target)) {
            throw "Data issue";
        }
    },
    addEdges: function(edges) {
        _.each(edges, function(e) {
            this.addEdge(e);
            var params = {originEdge: e}; // this is a hack - we two way bind it but there should actually be inclussion of Edge
            e.edgeRef = new Edge(params);
        }.bind(this));
        this.allEdges = edges;
    },
    getV: function(eId) {
        return _.findWhere(this.netVertices, {id: eId});
    },

    // Public Functions
    // Dynamically change parameters during runtime
    checkAndSetParams: function(conf) {
        _.each(this.netVertices, function(v) {
            v.checkAndSetParams(conf);
        });
        _.each(this.netEdges, function(e) {
            e.edgeRef.checkAndSetParams(conf.edgeConf);
        });
        this.resetRoots(conf.roots);
    },
    // Perform external operations. e.g. 
    // 1) setting D3 visual objects 
    // 2) sending data to "Melodi Generator" or DMX components
    prepareExternalDataForNextCycle: function() {
        // this is somewhat hacky but necessary in order to allow running both in the server and the browser 
        // and running in the server and displaying the output in the browser
        try {
            if (globalNetStateJson) {
                this.preCycleOps(globalNetStateJson);    
            } else {
                var translatedOutput = stateTranslator.translate({allEdges: this.allEdges, allVertices: this.netVertices});
                this.preCycleOps(translatedOutput);
            }
        } catch(e) {
            console.log("Exception in 'preCycleOps':" + e);
        }
    },


    // Give roots an initial value - signal has to start somewhere.
    // We can have more than one root in order to simulate flow from different parts of the net
    // In reality the roots should probably be "hidden", meaning they might not need to represent an actual node
    updateRoots: function() {
        function countNumActiveEdges(edges) {
            amount = 0;
            _.each(edges, function(e){
                amount += (e.edgeRef.isActive()) ? 1 : 0;
            });
            return amount;
        }
        var netState = {
            numActiveEdges: countNumActiveEdges(this.netEdges)
        };
        _.each(this.netVertices, function(v){v.updateRoots(netState)});
    },
    determineCurrentState: function() {
        _.each(this.netVertices, function(v){v.determineCurrentState()});
    },
    determineNetworkEffect: function() {
        _.each(this.netVertices, function(v){v.determineNetworkEffect()});
        _.each(this.netEdges, function(e){e.edgeRef.determineNetworkEffect()});
    },

    // Relays the state of each Vertice & Edge through a callback 'externalActivationCallback' 
    // which is provided by the external consumer
    relayNetStateToExternalConsumer: function() {
    },

    tick: function() {
        this.externaltick();
    },

    // Used by Layers to determine what is the next phase of the Net.
    // Used by 'NeuralNetLayer' to determine which node send signals.
    causeNetworkEffect: function() {
        _.each(this.netVertices, function(v){v.causeNetworkEffect()});
    },


    prepareForNextState: function() {
        _.each(this.netVertices, function(v){v.prepareForNextState()});
    }

};		