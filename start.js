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
		items.forEach(function(item) {
			topics.push(item.topic);
		});
		mqttClient.subscribe(['james/lcn/LCN/sensor/0/10/4']);
		mqttClient.publish(nconf.get('mqtt:options:will:topic'), 'online');
	});

	mqttClient.on('message', function (topic, message) {
		var cmd = 'vcgencmd display_power 0';
		if (parseInt(message) == 1) {
			cmd = 'vcgencmd display_power 1';
		}
		exec(cmd, function(error, stdout, stderr) {
			//
		});
	});
};

main();
