main = {
	init: function(networkDeffinition) {
		if (!isWebserver()) {
			var netToRun = buildFLuideSelfNetwork(networkDeffinition, [webGLGraphModule()]);

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
		} else {
			// Nothing to calculate since data arrives from the server
			var netToRun = buildFLuideSelfNetwork(networkDeffinition, [webGLGraphModule()]);
			var mainTicker = function() {
				netToRun.checkAndSetParams(conf);

				netToRun.prepareExternalDataForNextCycle();

				setTimeout(mainTicker, conf.cycleTime);
			};

			setTimeout(mainTicker, conf.cycleTime);
		}
	}
};

main.init(networkDef);