var moment = require('moment');
var databaseUrl = "localhost:12345/smart-light";
var collections = ["live_data"]
var mongojs = require('mongojs');
var moment = require('moment');
var db = mongojs(databaseUrl, collections);



let solarVoltage = 10,
	solarCurrent = 20,
	batteryVoltage = 10,
	batteryCurrent = 13,
	energyGeneration,
	energyConsumption,
	data = {};

let totalData = [{
    "_id" : {
        "customer" : "HYPERTHINGS",
        "country" : "INDIA",
        "state" : "Karnataka",
        "city" : "bangalore",
        "solution" : "Smart-Light",
        "gateway" : "HTTP",
        "deviceType" : "Rooftop",
        "device" : "site1",
        "deviceNmae" : "device-1",
        "siteName" : "site-1",
        "ts" : "2018-03-13T10:45:00.000Z"
    },
    "deviceNmae" : "device-1",
    "siteName" : "site-1",
    "lat" : 12.914619,
    "long" : 77.632726,
    "powerStatus" : "ON",
    "powerSource" : "EB",
    "temperature" : 28.0,
    "displayName" : "site1",
    "solarVoltage" : 52.4,
    "solarCurrent" : 19.3,
    "batteryVoltage" : 32.5,
    "batteryCurrent" : 30.9,
    "ledIndensity" : 51.7,
    "lightStatus" : 1,
    "deviceDamper" : 1,
    "batteryDischarging" : 22.3,
    "batteryCharging" : 64.7,
    "batteryConsumption" : 23.9,
    "motionSense" : 34.7,
    "alarams" : 3,
    "energyGeneration" : 976,
    "energyConsumption" : 846,
    "ts" : "2018-03-13T10:45:00.000Z"
},
 {"_id" : {
        "customer" : "HYPERTHINGS",
        "country" : "INDIA",
        "state" : "Karnataka",
        "city" : "bangalore",
        "solution" : "Smart-Light",
        "gateway" : "HTTP",
        "deviceType" : "Rooftop",
        "device" : "site1",
        "deviceNmae" : "device-2",
        "siteName" : "site-1",
        "ts" : "2018-03-13T10:45:00.000Z"
    },
    "deviceNmae" : "device-2",
    "siteName" : "site-1",
    "lat" : 12.914619,
    "long" : 77.632726,
    "powerStatus" : "ON",
    "powerSource" : "EB",
    "temperature" : 32.0,
    "displayName" : "site1",
    "solarVoltage" : 59.4,
    "solarCurrent" : 16.3,
    "batteryVoltage" : 32.3,
    "batteryCurrent" : 37.9,
    "ledIndensity" : 58.7,
    "lightStatus" : 1,
    "deviceDamper" : 1,
    "batteryDischarging" : 32.3,
    "batteryCharging" : 82.7,
    "batteryConsumption" : 37.9,
    "motionSense" : 62.7,
    "alarams" : 4,
    "energyGeneration" : 829,
    "energyConsumption" : 725,
    "ts" : "2018-03-13T10:45:00.000Z"
},
 {"_id" : {
        "customer" : "HYPERTHINGS",
        "country" : "INDIA",
        "state" : "Karnataka",
        "city" : "bangalore",
        "solution" : "Smart-Light",
        "gateway" : "HTTP",
        "deviceType" : "Rooftop",
        "device" : "site1",
        "deviceNmae" : "device-1",
        "siteName" : "site-2",
        "ts" : "2018-03-13T10:45:00.000Z"
    },
    "deviceNmae" : "device-1",
    "siteName" : "site-2",
    "lat" : 12.914619,
    "long" : 77.632726,
    "powerStatus" : "ON",
    "powerSource" : "EB",
    "temperature" : 32.0,
    "displayName" : "site1",
    "solarVoltage" : 72.4,
    "solarCurrent" : 18.3,
    "batteryVoltage" : 28.3,
    "batteryCurrent" : 32.9,
    "ledIndensity" : 48.7,
    "lightStatus" : 1,
    "deviceDamper" : 1,
    "batteryDischarging" : 32.3,
    "batteryCharging" : 73.7,
    "batteryConsumption" : 42.9,
    "motionSense" : 77.7,
    "alarams" : 2,
    "energyGeneration" : 1209,
    "energyConsumption" : 1023,
    "ts" : "2018-03-13T10:45:00.000Z"
},
 {"_id" : {
        "customer" : "HYPERTHINGS",
        "country" : "INDIA",
        "state" : "Karnataka",
        "city" : "bangalore",
        "solution" : "Smart-Light",
        "gateway" : "HTTP",
        "deviceType" : "Rooftop",
        "device" : "site1",
        "deviceNmae" : "device-1",
        "siteName" : "site-3",
        "ts" : "2018-03-13T10:45:00.000Z"
    },
    "deviceNmae" : "device-1",
    "siteName" : "site-3",
    "lat" : 12.914619,
    "long" : 77.632726,
    "powerStatus" : "ON",
    "powerSource" : "EB",
    "temperature" : 33.0,
    "displayName" : "site1",
    "solarVoltage" : 88.4,
    "solarCurrent" : 17.3,
    "batteryVoltage" : 30.3,
    "batteryCurrent" : 29.9,
    "ledIndensity" : 49.7,
    "lightStatus" : 1,
    "deviceDamper" : 1,
    "batteryDischarging" : 32.3,
    "batteryCharging" : 69.7,
    "batteryConsumption" : 29.9,
    "motionSense" : 45.7,
    "alarams" : 1,
    "energyGeneration" : 1234,
    "energyConsumption" : 892,
    "ts" : "2018-03-13T10:45:00.000Z"
}];



data.energyGeneration = (solarVoltage * solarCurrent) * 1000;

data.energyConsumption = (batteryVoltage * batteryCurrent) * 1000;

/*db.today_datas.save(data, function(err,data){
	if(err) {
		console.log(err);
	}else {
		console.log(data);
	}
})*/

for(let data of totalData) {

	let addToExistingData = {
		energyGeneration: data.energyGeneration,
		energyConsumption :data.energyConsumption,
		batteryCharging: data.batteryCharging,
		alarams: data.alarams,
		motionSense: data.motionSense,
		batteryConsumption: data.batteryConsumption,
		batteryDischarging: data.batteryDischarging,
		ledIndensity: data.ledIndensity,
		solarVoltage: data.solarVoltage,
		solarCurrent: data.solarCurrent,
		batteryVoltage: data.batteryVoltage,
		batteryCurrent: data.batteryCurrent,
		temperature: data.temperature
	}

	db.today_datas.save(data, function(err,data){
		if(err) {
			console.log(err);
		}else {
			console.log('today',data);
		}
	})

	db.history.save(data, function(err,data){
		if(err) {
			console.log(err);
		}else {
			console.log('history',data);
		}
	})
	

	db.site_wise_data.update({'siteName':data.siteName,'ts' : data.ts},{$inc: addToExistingData},{ upsert:true }, function(err,data){
		if(err) {
			console.log(err);
		}else {
			console.log('site data',data);
		}
	})

	db.all_sites_data.update({'ts' : data.ts},{$inc: addToExistingData},{ upsert:true }, function(err,data){
		if(err) {
			console.log(err);
		}else {
			console.log('all sites',data);
		}
	})

}



/*db.live_data.update({'serialno' : serialno},data,{ upsert:true }, function(err,data){
		if(err) {
			console.log(err);
		}else {
			console.log('all sites',data);
		}
	})*/        //"ts" : "2018-03-13T10:45:00.000Z"