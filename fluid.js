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


isNode = true;
var basePath = "./scripts/graph/";
var jsFiles = ['configuration.js', 'NeuralNetLayer.js', 'SignalLayer.js', 
					'Layers.js', 'Vertice.js', 'Edge.js', 'Net.js', 'netGen.js', 'fluideSelfNetwork.js', 
					'algorithms.js'
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



function runFluid(networkDeffinition, modules){
	// var modulesArr = [fluidServerModule(clientAPI)];
	var netToRun = buildFLuideSelfNetwork(networkDeffinition, modules);

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
	
	var client = new osc.Client(host, port); //var client = new net.Socket();

	// client.connect(port, host, function() {
	//     console.log('CONNECTED TO: ' + host + ':' + port);
	//     // sendNextDataLoop();
	//     // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
	//     client.write('Hello from fluidServer');
	// });
	function sendNextDataLoop() {
		// client.write("myNet: " + JSON.stringify(myNet));
		// setTimeout(sendNextDataLoop, 1000);
	}
	// Add a 'data' event handler for the client socket
	// data is what the server sent to this socket
	// client.on('data', function(data) {
	//     dataFunction(data);
	// });

	// // Add a 'close' event handler for the client socket
	// client.on('close', function() {
	//     console.log('Writer: Connection closed... (' + host + ':' + port + ')');
	//     setTimeout(function() {
	//     	createClient(host, port, name, dataFunction)
	//     }, 1000);
	// });

	// client.on('error', function (e) {
	//   if (e.code == 'EADDRINUSE') {
	//     console.log('Address in use, retrying... (' + host + ':' + port + ')');
	//     setTimeout(function () {
	//       client.close();
	//       client.listen(port, host);
	//     }, 1000);
	//   }
	// });
	return client;
}

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
	  });

	  socket.on('change_conf', function(msg){
  		conf = JSON.parse(msg);
	  	console.log('New Configuration: ' + msg);
	  });
	});

	http.listen(serverAPI_PORT, function(){
	  console.log('listening on *:' + serverAPI_PORT);
	});
}



