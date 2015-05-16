//fluid main
// For web API
var express = require('express');
var serverAppAPI = express();
var http = require('http').Server(serverAppAPI);
var io = require('socket.io')(http);

// For socket based communication
var net = require('net');
var osc = require('node-osc'); //include node-osc library https://github.com/TheAlphaNerd/node-osc
var fs = require('fs'); // For loading all files into the global namespace - hacky but works..

// Plugins
global._ = require('./scripts/plugins/underscore.js');
globalNetStateJson = undefined; // we always run the net logic on the server

isNode = true;
var basePath = "./scripts/graph/";
var jsFiles = ['configuration.js', 'NeuralNetLayer.js', 'SignalLayer.js', 'RandomLayer.js', 
					'Layers.js', 'Vertice.js', 'Edge.js', 'Net.js', 'netGen.js', 'fluideSelfNetwork.js', 
					'algorithms.js', 'stateTranslator.js'
					];

var networkDef = require(basePath + 'networkDef.js');
for (var i=0; i<jsFiles.length; i++) {
	var location = "./" + basePath + jsFiles[i];
	eval(fs.readFileSync(location)+'');
}



var clientAPI = createClient('127.0.0.1', 6699, 'fluidServerModule', function(data) {
	    console.log("DATA from : 'fluidServerModule'" + data);
});

var modulesArr = [
	require(basePath + 'sensorAdapterModule.js').sensorAdapterModule(),
	require(basePath + 'fluidServerModule.js').fluidServerModule(clientAPI)
];

createWebServerAPI();

runFluid(networkDef.networkDef, modulesArr);



function runFluid(networkDefinition, modules){
	// var modulesArr = [fluidServerModule(clientAPI)];
	var netToRun = buildFLuideSelfNetwork(networkDefinition, modules);
	// console.log('e: ' + netToRun.allEdges.length + ', v:' + netToRun.allVertices.length)
	gloablRunningNetObj = netToRun; // Hacky !!!

	var mainTicker = function() {
		netToRun.checkAndSetParams(conf);
		// netToRun.checkAndSetParams('verticeProbability');

		netToRun.prepareExternalDataForNextCycle();

		netToRun.updateRoots();
		netToRun.determineCurrentState();
		netToRun.determineNetworkEffect();

		// Paint edges of the signaling vertices
		netToRun.relayNetStateToExternalConsumer();

		netToRun.tick(); // Render the net 

		netToRun.causeNetworkEffect();
		netToRun.prepareForNextState();

		setTimeout(mainTicker, conf.cycleTime);
	};

	setTimeout(mainTicker, conf.cycleTime);
}



function createClient(host, port, name, dataFunction) {
	var client = new osc.Client(host, port); 
	return client;
}

// https://github.com/rauchg/chat-example
function createWebServerAPI() {
	var serverAPI_PORT = '3333';

	serverAppAPI.get('/', function(req, res){
		var path = __dirname + '/index.html';
		console.log('loading: ' + path);
	  res.sendFile(path);
	});

	serverAppAPI.use('/scripts', express.static(__dirname + '/scripts'));

	io.on('connection', function(socket){
	  socket.on('chat message', function(msg){
	    io.emit('chat message', msg);
	    console.log('Browser said: ' + msg);
	  });

	  socket.on('change_conf', function(msg){
  		conf = JSON.parse(msg);
  		globalNetObject.checkAndSetParams(conf);
	  	console.log('New Configuration: ' + JSON.stringify(conf));
	  });

	  socket.on('touch_edge', function(msg){
	  	var id = JSON.parse(msg);
	  	console.log('Vertice ' + id + ' touched by browser');
		var v = _.findWhere(gloablRunningNetObj.netVertices, {id: id});
		v.triggerSignal();
	  });

	  socket.on('update_webgl_view', function(msg){
        io.emit('update_webgl_view', (stateTranslator.translate(gloablRunningNetObj)));
      });
	});

	http.listen(serverAPI_PORT, function(){
	  console.log('listening on localhost:' + serverAPI_PORT);
	});
}


