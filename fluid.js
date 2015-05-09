//fluid main

var net = require('net');
var fs = require('fs');

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



var HOST = '127.0.0.1';
var PORT = 69699;
var clientAPI = createClient();

require(basePath + 'fluidServerModule.js')();
runFluid(networkDef.networkDef);




function runFluid(networkDeffinition){
	var netToRun = buildFLuideSelfNetwork(networkDeffinition, [fluidServerModule(clientAPI)]);

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



function createClient() {
	var client = new net.Socket();

	client.connect(PORT, HOST, function() {
	    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
	    // sendNextDataLoop();
	    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
	    // client.write('I am Chuck Norris!');
	});
	function sendNextDataLoop() {
		// client.write("myNet: " + JSON.stringify(myNet));
		// setTimeout(sendNextDataLoop, 1000);
	}
	// Add a 'data' event handler for the client socket
	// data is what the server sent to this socket
	client.on('data', function(data) {
	    
	    console.log('DATA: ' + data);
	    // Close the client socket completely
	    // client.destroy();
	    
	});

	// Add a 'close' event handler for the client socket
	client.on('close', function() {
	    console.log('Writer: Connection closed...');
	    setTimeout(createClient, 1000);
	});

	client.on('error', function (e) {
	  if (e.code == 'EADDRINUSE') {
	    console.log('Address in use, retrying...');
	    setTimeout(function () {
	      client.close();
	      client.listen(PORT, HOST);
	    }, 1000);
	  }
	});
	return client;
}




