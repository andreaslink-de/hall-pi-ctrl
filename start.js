process.title = 'hall-pi-ctrl';

process.on('uncaughtException', function(e) {
	console.log('Uncaught Exception...');
	console.log(e.stack);
	process.exit(99);
});

var nconf = require('nconf'),
		defaultConfig = require('./defaultConfig.json'),
		mqtt = require('mqtt'),
		exec = require('child_process').exec;

main = function () {
	nconf.env('__').argv();
	nconf.file('custom', './config.json');
	nconf.file('etc', '/etc/hall-pi-ctrl/config.json');
	nconf.defaults(defaultConfig);

	var mqttClient = mqtt.connect(
			nconf.get('mqtt:url'),
			nconf.get('mqtt:options')
	);

	mqttClient.on('connect', function () {
		console.log('mqtt connected');
		var topics = [];
		mqttClient.subscribe([
			'james/lcn/LCN/sensor/0/10/4', // BWM Flur EG
			'james/lcn/LCN/sensor/0/12/3' // Klingel
		]);
		mqttClient.publish(nconf.get('mqtt:options:will:topic'), 'online');
	});

	var switchDisplay = function(power) {
		var cmd = 'vcgencmd display_power ' + power;
		exec(cmd, function(error, stdout, stderr) {
		//
		});
	};

	var switchTimeout;
	mqttClient.on('message', function (topic, message) {
		if (parseInt(message) == 1) {
			clearTimeout(switchTimeout);
			switchDisplay(1);
		} else {
			switchTimeout = setTimeout(function() {
				switchDisplay(0);
			}, 30000);	
		}
	});
};

main();
