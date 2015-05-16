
// Init
var edgeRepresentation =_.map(networkDef.edges, function(e){return '('+e.s+','+e.t+')'});
setViewVal('network_edges_id', edgeRepresentation.join(','));
setViewVal('node_activation_id', "1");
setViewVal('roots_id', _.map(conf.roots, function(v) {return (v+1)}));
setViewVal('roots_probability_id', conf.rootProbability);
setViewVal('active_edge_limit_id', conf.rootProbability);
// setViewVal('cycle_time_id', conf.cycleTime);
setViewVal('threshold_id', conf.threshold);
setViewVal('probability_id', conf.verticeProbability);

// Edge Conf
setViewVal('edge_activity_time_id', conf.edgeConf.meanActivityTime);
setViewVal('edge_deviation_time_id', conf.edgeConf.activityTimeDeviation);

// Dom Setters
function setViewVal(id, v) {
	document.getElementById(id).value = v;
}

// Callbacks
function changeNetworkSettings(event) {
	try {
		var newEdges = document.getElementById('network_edges_id').value.split('(');
		newEdges = _.filter(newEdges, function(e) {return !_.isEmpty(e);});
		newEdges = _.map(newEdges, function(e) {
			if (!_.isEmpty(e)) {
				var s = parseInt(e.split(',')[0]);
				var t = parseInt(e.split(',')[1].split(')')[0]);
				return {s:s, t:t};
			}
		});

		var newNetDef = createNetDef(networkDef.vertices, newEdges)
		var webGLContainer = document.getElementById('web_gl_container');
		webGLContainer.innerHTML = '';
		main.init(newNetDef);
	} catch(e) {
		return alert('Ooops, you fucked something up... Let Noni know what you did...');
	}
}

function activateNode(that) {
	var nodeId = (parseInt(that.value) - 1);
	if (_.isNumber(nodeId)) {
		var v = globalNetObject.getV(nodeId);
		if (v) v.triggerSignal();
	}
	sendConfToServer();
}

function changeRoots(that) {
	var arr = that.value.split(',');
	arr = _.map(arr, function(v){ return (parseInt(v)-1); });
	globalNetObject.resetRoots(arr);
	sendConfToServer();
}

// function changeCycleTime(that) {
// 	var val = parseInt(that.value);
// 	if (val) {
// 		conf.cycleTime = val;		
// 	}
// }

function changeNodeThreshold(that) {
	var val = parseInt(that.value);
	if (val) {
		conf.threshold = val;		
	}
	sendConfToServer();
}

function setInt(that, property) {
	var val = parseInt(that.value);
	if (val) {
		conf[property] = val;		
	}
	sendConfToServer();
}

function setFloat(that, property) {
	var val = parseFloat(that.value);
	if (val) {
		conf[property] = val;		
	}
	sendConfToServer();
}

// Edge Conf
function setEdgeFloat(that, property) {
	var val = parseFloat(that.value);
	if (val) {
		conf.edgeConf[property] = val;		
	}
	sendConfToServer();
}

function sendConfToServer() {
	socket.emit('change_conf', JSON.stringify(conf));
}
