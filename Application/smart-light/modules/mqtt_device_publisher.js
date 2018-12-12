var mongojs = require('mongojs');
var mqtt = require('mqtt');
var moment = require('moment');
//var mqtt_server = require('./mqtt_server.js')
//var db = mongojs('localhost:12345/smart-light');
var exports = module.exports = {};


 
//var server = require('../server.js');

//var mqttUrl = "http://iot.hyperthings.in";
var mqttUrl = "mqtt://iot.eclipse.org";
	var exports = module.exports = {};

	var settings = {
		port : 1883,
	    //port : 6024,
	    clientId: 'htsiot1',
		//username: 'htsuser',
		//password: 'hts@123',
	    clean: true,
	    reconnectPeriod: 30000 * 1,
	    rejectUnauthorized: false
	}

	let client  = mqtt.connect(mqttUrl,settings); 

	let topic = "Demo/B827EBF6D82E/Data/Live";
	let publishData = [];

	
//setInterval(function(){
	for(let i=0; i<100; i++){
		let data = {"SV": 95, "LED": 69, "BC": 70, "Diag": 47, "Solution": "EMS", "ts": 1528353843, "DDT": "Live", "BV": 13199, "SN": "123456789", "AppId": "Evolute", "SC": 0}
		data.SN = 1001+i;
		data.ts = moment()._d;
		//publishData.push(data)

		client.on('connect', function () {
		    console.log("*******Client Connected*******");
			client.publish(topic, JSON.stringify(data));
			//client.end();
		});
	}
//},10000)
	

	
