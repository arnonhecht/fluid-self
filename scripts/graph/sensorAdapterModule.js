
var net = require('net');

var _moduleName = 'sensorAdapterModule';
sensorAdapterModule = function() {

	var HOST = '127.0.0.1';
	var PORT = 20515;

	function createListener(net, host, port, name, dataFunction) {
		console.log('creating server')
		var server = net.createServer(function(sock) {
		    
		    // We have a connection - a socket object is assigned to the connection automatically
		    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
		    
		    // Add a 'data' event handler to this instance of socket
		    sock.on('data', function(data) {
		        dataFunction(data);
		    });
		    
		    // Add a 'close' event handler to this instance of socket
		    sock.on('close', function(data) {
		        console.log('Listener: Connection Closed: ' + sock.remoteAddress +' '+ sock.remotePort);
		        setTimeout(function() {
		        	createListener(host, port, name, dataFunction);
		        }, 1000);
		    });
		});
		console.log("createListener starting to listen");
		server.listen(port, host);

		server.on('error', function (e) {
		  if (e.code == 'EADDRINUSE') {
		    console.log('Address in use, ... (' + host + ':' + port + '). RIGHT NOW WE DIE - NEED TO REMOVE SOCKET FD');
		    // setTimeout(function () {
		    //   server.close();
		    //   createListener(host, port, name, dataFunction);
		    // }, 1000);
		  }
		});
	}


	var me = this;
	me.name = _moduleName;
	me.api = createListener(net, HOST, PORT, 'fluidServerModule', function(data) {
	    console.log("DATA from : 'sensorAdapterModule':  " + data);
	    var str = (data.toString().split(',')[0])
	    var res = '';
	    _.each(str, function(c){
	    	if (!_.isNaN(parseInt(c))) {
		    	res += c;	    		
	    	}
	    });
	    if (!_.isNaN(parseInt(res))) {
		    me.signalsCache.push(parseInt(res));
	    }
	});

	me.init = function(netStruct) {
		// Callbacks for the Net 
		me.signalsCache = [];
		me.preCycleOps = function(netStruct) {
			_.each(netStruct.allVertices, function(v) {
				if (_.contains(me.signalsCache, v.id)) {
					v.triggerSignal();
				}
			});
			me.signalsCache = [];
	    };

	    me.externalActivationCallback = function(args) {
	    	if (!_.isEmpty(args.edge)) {
        		console.log('Vertice activation: ' + args);
        	} else if (!_.isEmpty(args.vertice)) {
    			console.log('Edge activation: ' + args);
        	}
	    };


	    me.tick = function () {

	    };
	};

	return me;
}

module.exports.sensorAdapterModule = sensorAdapterModule;