var moment = require('moment');
var databaseUrl = "localhost:12345/smart-light"; // "username:password@example.com/mydb"
var collections = ["devices","parking_occupancy","test","live_data","area_comparison"]
var mongojs = require('mongojs');
var moment = require('moment');
var db = mongojs(databaseUrl, collections)
//var _ = require('underscore');
//var async = require('async')
var exports = module.exports = {};

exports.formatData =  function(datas,parameter){
	console.log(datas);
	let lightData = {}
		lightData.ts = [];
		lightData.batteryVoltage = [];
		lightData.solarVoltage = [];
		lightData.solarCurrent = [];
		lightData.batteryCurrent = [];
		if(datas.length > 0) {
			lightData.ledIndensity = datas[datas.length-1].ledIndensity;
		}

		lightData.totalEnergyGeneration = 0;
		lightData.totalEnergyConsumption = 0;

		lightData.lightStatusOn = 0;
		lightData.lightStatusOff = 0;
		lightData.deviceHealthError = 0;
		lightData.deviceHealthWarning = 0;
		//lightData.deviceDamper = [];
		lightData.batteryDischarging = [];
		lightData.batteryCharging = [];
		lightData.batteryConsumption = [];
		lightData.motionSense = [];
		for(let data of datas){
			//if (data._id.packet == 1) {
				lightData.ts.push(moment(data.ts).format('YYYY-MM-DD HH:mm:ss'));
				lightData.batteryVoltage.push(data.BV);
				lightData.solarVoltage.push(data.SV);
				lightData.solarCurrent.push(data.SC);
				lightData.batteryCurrent.push(data.BC);
				//lightData.ledIndensity.push(data.ledIndensity);
			//}

			//if (data._id.packet == 2) {

				lightData.batteryDischarging.push(data.batteryDischarging);
				lightData.batteryCharging.push(data.batteryCharging);
				lightData.batteryConsumption.push(data.batteryConsumption);
				lightData.motionSense.push(data.motionSense);
				lightData.deviceHealthError  += Number(data.Tamper) + Number(data.DeviceTamper) + Number(data.RTCHealth)
												Number(data.SolarHealth) + Number(data.BatteryHelath);
				lightData.deviceHealthWarning += Number(data.ledHealth) + Number(data.LDRHealth);
				if (data.lightStatus == 1) {
					lightData.lightStatusOn += 1;
				}else if ( data.lightStatus == 0 ) {
					lightData.lightStatusOff += 1;
				}
				if (data.EGeneration) {
					lightData.totalEnergyGeneration += data.EGeneration;
					lightData.totalEnergyConsumption += data.EConsumption;
				}
			//}
		}
				console.log("EGen",lightData.totalEnergyGeneration)
		lightData.deviceHealthError = lightData.deviceHealthError/datas.length;
		lightData.deviceHealthWarning = lightData.deviceHealthWarning/datas.length;
	return lightData;
}


exports.overallFormattedDatas = function(datas,parameter){
	formattedSitesData = {};
	formattedSitesData.totalEnergyGeneration = 0;
	formattedSitesData.totalEnergyConsumption = 0;
	formattedSitesData.lightStatus = 0;
	for(let data of datas){
		if (data._id.packet == 1) {
			formattedSitesData.totalEnergyGeneration += data.energyGeneration;
			formattedSitesData.totalEnergyConsumption += data.energyConsumption;
		}

		if (data._id.packet == 2) {
			if (data.lightStatus == 1) {
				formattedSitesData.lightStatus += 1
			}
		}
	}
	return formattedSitesData;
}


exports.getDistinctDatas = function(datas,parameter){
	return datas
}


/* $gte: new Date("2018-05-02T06:51:45.000Z"),
        $lte: new Date("2018-05-02T08:51:45.000Z")*/

/* let query = {
 	"_id.siteName" : "HTS",

 	"_id.ts" :  {
        $gte: moment().add(2, 'hours').add(30, 'minutes')._d,
        $lte: moment().add(5, 'hours').add(30, 'minutes')._d    
    }
};



console.log(query);
    db.collection("today_data").find(query, function (err, datas) {
        if (err || !datas) console.log("No data found");
         //else callback(datas);
        else {
        	let flags = [], l = datas.length, i, dataArray = [];
			for( i=0; i<l; i++) {
				console.log('flags[datas[i]._id.deviceName',flags[datas[i]._id.deviceName]);
			    if( flags[datas[i]._id.deviceName]) continue;
			    flags[datas[i]._id.deviceName] = true;
			    dataArray.push(datas[i]);
			}
        	//console.log(datas);
        }
    });*/