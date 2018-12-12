 
//var server = require('../server.js');
var mqtt = require('mqtt');

var mqttUrl = "http://iot.hyperthings.in";
//var mqttUrl = "mqtt://iot.eclipse.org";
	var exports = module.exports = {};

	var settings = {
		//port : 1883,
	    port : 6024,
	    clientId: 'htsiot1',
		username: 'htsuser',
		password: 'hts@123',
	    clean: true,
	    reconnectPeriod: 2000 * 1,
	    rejectUnauthorized: false
	}

	var client  = mqtt.connect(mqttUrl,settings); 
	client.on('connect', function () {
	    console.log("*******Client Connected*******");
	     client.subscribe("HTS/+/COMMAND/RESPONSE");
	});

exports.mqttClient = function(){
	
	return client;
}


exports.mqttClientStatus = function(req, res, parameter, callback){
	
	let  clientStatus  = mqtt.connect(mqttUrl,settings); 
	clientStatus.on('connect', function () {
	    console.log("*******Client Connected*******");
	    clientStatus.end();
	    callback( 'Successful');
	});
	clientStatus.on('offline', function() {
	    console.log("offline");
	    clientStatus.end();
	    callback('Unsuccessful');
	});
	//clientStatus.end();
}