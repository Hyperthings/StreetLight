// required modules
var mqtt = require('mqtt');
var mongojs = require('mongojs');
var moment = require('moment');
var async = require('async');
var _ = require('underscore');
var utillty = require('./utill.js');
var cron = require('node-cron');
var logger = require("./Streetlogger");
var fifo = require('fifo')()
var MongoClient = require('mongodb').MongoClient;
//var Mongourl = "mongodb://192.168.0.155:12345/";
var Mongourl = "mongodb://localhost:12345/";
//var db = mongojs('localhost:12345/smart-light');
//var db = mongojs('192.168.0.155:12345/smart-light');
var url = "mqtt://localhost";
//var url = "mqtt://iot.hyperthings.in";

var DeviceDetails = {};
var SiteWiseData={};
var CompleteFlag = 0;
var Rawdata = {};
var settings = {
	port :6024,
    clientId: 'b8d3b36d-6e35-494d-9696-adec7ba9a0c2',
	username: 'htsuser',
	password: 'hts@123',
    clean: true,
    reconnectPeriod: 2000 * 1,
	rejectUnauthorized: false
}

cron.schedule('59 5 * * *', function(){
  MongoClient.connect(Mongourl, function(err, db) {
  if (err) throw err;
  var dbo = db.db("smart-light");
  dbo.collection("today_data").drop(function(err, delOK) {
    if (err) throw err;
    if (delOK) console.log("today_data Collection deleted");
    db.close();
  });
});
  TimeSyncCommand();
  logger.info("daily collection droped.");
});

var TimeSyncCommand = function(msg)
{
	var TimeIndex = 0;
	var payLoadText = {}
	var Tdate = new Date();
	async.series(
	{
        saveRawData: function (selfcb) 
		{        
            MongoClient.connect(Mongourl, function(err, db) {
			if (err) throw err;
			var dbo = db.db("smart-light");
			dbo.collection("gateway_details").find({}).toArray(function(err, result) {
			if (err) throw err;
			GatewayDetails = result;
			for(TimeIndex=0;TimeIndex<result.length ;TimeIndex++)
			{
				payLoadText = '{"CommandID":'+Math.floor(100000000 + Math.random() * 900000000)+',"MacAddress":"'+ GatewayDetails[TimeIndex].gatewayName +'","Command":"Time","Time":"'+ moment().format('ss-mm-HH-d-DD-MM-YY') +'"}';
				console.log(payLoadText);
				client.publish('HTS/'+GatewayDetails[TimeIndex].gatewayName+'/COMMAND/TIME', payLoadText);
			}
			
			db.close();
			selfcb(err);
			}); 
			});
        }
	});
	CompleteFlag = 0;
}


var client  = mqtt.connect(url,settings);

client.on('connect', function () {
	logger.info("*******Street Light Client Connected*******")
   client.subscribe("HTS/+/Data/+", { qos: 0 });
   GetDeviceDetails();
 //  GetSiteWiseData();
});

client.on('message', function (topic, message) {
  // saveData(message.toString());
 fifo.push(message.toString());
});

client.on("error", function(error) {
   logger.info("Street Light Client ERROR: ", error);
});

client.on('offline', function() {
    logger.info("Street Light Client :offline");
});

client.on('reconnect', function() {
	logger.info("Street Light Client :reconnect");
});

setInterval(
    function(){
        if(fifo.length > 0 && CompleteFlag == 0)
		{
			CompleteFlag = 1;
			saveData(fifo.shift());
			
		} 
    },
50)
setInterval(
    function(){
		GetDeviceDetails();
    },
1000*20) 
var GetDeviceDetails= function(msg)
{
	//console.log("GetDeviceDetails");
	
	MongoClient.connect(Mongourl, function(err, db) {
  if (err) throw err;
  var dbo = db.db("smart-light");
  dbo.collection("device_details").find({}).toArray(function(err, result) {
    if (err) throw err;
	DeviceDetails = result;
//    console.log(result);
    db.close();
	//MongoClient.close();
  });
});

	
/*	db.collection('device_details').find({}, function(err, respos)
	{
        if( err || !respos ) 
		{
			logger.error("device not updated",err,respos);
		//	SaveRawDataToDB(respos);
			//selfcb(err);
		}
		else 
		{
			DeviceDetails= respos;
//			console.log(respos);
		}
	});*/
}
/*var GetSiteWiseData= function(msg)
{
	console.log("GetSiteWiseData");
	db.collection('site_wise_data').find({}, function(err, respos)
	{
        if( err || !respos ) 
		{
			logger.error("device not updated",err,respos);
		//	SaveRawDataToDB(respos);
			//selfcb(err);
		}
		else 
		{
			SiteWiseData= respos;
		//	console.log(respos);
		}
	});
} */
var saveData = function(msg)
{	
//	console.log(JSON.parse(msg));
	var DeviceDetail = {};
	var data = {}
	var Message = {}
	data = JSON.parse(msg);
    var currentConfiguredData = {};
	var PacketTime ={}
	Rawdata = data;
	//data.ts = data.ts + 19800;
	if(data.DDT == 'Live')
	{
		async.series(
		{
			GetSNNo: function (selfcb) 
			{
				var DeviceIndex = DeviceDetails.findIndex(k => k.deviceId==data.SN);
			//	console.log('Index'+DeviceIndex);
				if(DeviceIndex > -1)
				{
					Message._id={									
									deviceId : data.SN,
									ts : moment.unix(data.ts).subtract(0, 'minutes')._d,										
							};
					Message.ts = moment.unix(data.ts).subtract(0, 'minutes')._d;
					Message.siteName = DeviceDetails[DeviceIndex].siteName;
					Message.gatewayName = DeviceDetails[DeviceIndex].gatewayName;
					Message.gatewayId = DeviceDetails[DeviceIndex].gatewayId;
					Message.solution = DeviceDetails[DeviceIndex].solution;
					Message.deviceName = DeviceDetails[DeviceIndex].deviceName;
					Message.deviceMacAddress = DeviceDetails[DeviceIndex].deviceMacAddress;
					Message.latitude = DeviceDetails[DeviceIndex].latitude;
					Message.longitude = DeviceDetails[DeviceIndex].longitude;
					Message.address	= DeviceDetails[DeviceIndex].address;
					Message.SN = data.SN;
					Message.LED = data.LED;
					Message.Diag = data.Diag;
					Message.Solution = data.Solution;
					Message.DDT = data.DDT;
					Message.AppId = data.AppId;
					Message.SV = data.SV /1000;
					Message.SC = data.SC /1000;
					Message.BV = data.BV /1000;
					Message.BC = data.BC /1000;
					var n = Number(data.LED).toString(2);
					var d = "000000000".substr(n.length) + n;
				//		console.log(d);
					Message.ledIndensity = parseInt((d.slice(5, 9)),2)*10;
					Message.SCStatus = d.substring(4, 5);
					Message.lightStatus = d.substring(3, 4);
					Message.Tamper = d.substring(2, 3);
					n = Number(data.Diag).toString(2);
					d = "000000000".substr(n.length) + n;
//						console.log(d);
					Message.ledHealth = d.substring(8, 9);
					Message.RTCHealth = d.substring(7, 8);
					Message.SolarHealth = d.substring(6, 7);
					Message.BatteryHealth = d.substring(5, 6);
					Message.DeviceTamper = d.substring(4, 5);
					Message.LDRHealth  = d.substring(3, 4);
					PacketTime = moment.unix(data.ts).subtract(0, 'minutes')._d;
					var d = new Date(PacketTime);
				//	var n = d.getHours();
//						console.log(PacketTime);
//						console.log(d.getHours());
//						console.log(d.getMinutes());
					
					if((d.getHours() >= 6 && d.getHours() < 18))
					{
						Message.EGeneration = ((data.BV/1000) * (data.BC/1000)) /1000;
						Message.EConsumption= 0;
					//	console.log("Energy Generation  "+Message.EGeneration);
					}
					else if((d.getHours() >= 18 && (d.getHours() < 24 || d.getHours() < 6)))
					{
						Message.EConsumption = ((data.BV/1000) * (data.BC/1000))/1000;
						Message.EGeneration = 0;
					//	console.log("Energy Consumption  "+Message.EConsumption);
					}
					else
					{
						Message.EConsumption = 0;
						Message.EGeneration = 0;
					}
					SaveDataToDB(Message);
					//selfcb(null);
				}
				else
				{	
					logger.error("Street Light Client No Device Detail:" + data.SN);
					CompleteFlag = 0;
                    //selfcb(null);
                }
            },
		});
	}
	else if(data.DDT == 'State Change')
	{
		async.series(
		{
			GetSNNo: function (selfcb) 
			{	
				var DeviceIndex = DeviceDetails.findIndex(k => k.deviceId==data.SN);
			//	console.log('Index'+DeviceIndex);
				if(DeviceIndex > -1)
				{
				//	console.log('Index'+DeviceIndex);
					Message._id={									
									deviceId : data.SN,
									ts : moment.unix(data.ts).subtract(0, 'minutes')._d,										
							};
					Message.ts = moment.unix(data.ts).subtract(0, 'minutes')._d;
					Message.siteName = DeviceDetails[DeviceIndex].siteName;
					Message.gatewayName = DeviceDetails[DeviceIndex].gatewayName;
					Message.solution = DeviceDetails[DeviceIndex].solution;
					Message.deviceName = DeviceDetails[DeviceIndex].deviceName;
					Message.gatewayId = DeviceDetails[DeviceIndex].gatewayId;
					Message.deviceMacAddress = DeviceDetails[DeviceIndex].deviceMacAddress;
					Message.latitude = DeviceDetails[DeviceIndex].latitude;
					Message.longitude = DeviceDetails[DeviceIndex].longitude;
					Message.address	= DeviceDetails[DeviceIndex].address;
					Message.SN = data.SN;
					Message.LED = data.LED;
					Message.Diag = data.Diag;
					Message.Solution = data.Solution;
					Message.DDT = data.DDT;
					Message.AppId = data.AppId;
					Message.SV = data.SV /1000;
					Message.SC = data.SC /1000;
					Message.BV = data.BV /1000;
					Message.BC = data.BC /1000;
					var n = Number(data.LED).toString(2);
					var d = "000000000".substr(n.length) + n;
//						console.log(d);
					Message.ledIndensity = parseInt((d.slice(5, 9)),2)*10;
					Message.SCStatus = d.substring(4, 5);
					Message.lightStatus = d.substring(3, 4);
					Message.Tamper = d.substring(2, 3);
					n = Number(data.Diag).toString(2);
					d = "000000000".substr(n.length) + n;
//						console.log(d);
					Message.ledHealth = d.substring(8, 9);
					Message.RTCHealth = d.substring(7, 8);
					Message.SolarHealth = d.substring(6, 7);
					Message.BatteryHealth = d.substring(5, 6);
					Message.DeviceTamper = d.substring(4, 5);
					Message.LDRHealth  = d.substring(3, 4);
					PacketTime = moment.unix(data.ts).subtract(0, 'minutes')._d;
					var d = new Date(PacketTime);
				//	var n = d.getHours();
//						console.log(PacketTime);
//						console.log(d.getHours());
//						console.log(d.getMinutes());
					
					if((d.getHours() >= 6 && d.getHours() < 18))
					{
						Message.EGeneration = ((data.BV/1000) * (data.BC/1000)) /1000;
						Message.EConsumption= 0;
					//	console.log("Energy Generation  "+Message.EGeneration);
					}
					else if((d.getHours() >= 18 && (d.getHours() < 24 || d.getHours() < 6)))
					{
						Message.EConsumption = ((data.BV/1000) * (data.BC/1000))/1000;
						Message.EGeneration = 0;
					//	console.log("Energy Consumption  "+Message.EConsumption);
					}
					else
					{
						Message.EConsumption = 0;
						Message.EGeneration = 0;
					}
					SaveDataToDB(Message);
					selfcb(null);
				}
				else
				{	
					logger.error("Street Light Client No Device Detail:" + data.SN);
					CompleteFlag = 0;
                    selfcb(null);
                }
            },
		});
	}
	else if(data.DDT == 'TIME' ||data.DDT == 'DeviceConfiguration'||data.DDT == 'LEDCONTROL'||data.DDT == 'Register'||data.DDT == 'DeviceList' )
	{
		logger.info("command response:"+data.DDT+":"+data.Status);
	}
	
}

var SaveDataToDB = function(msg)
{	
	
	var message = msg;
	
	async.series(
	{
        updateLiveData: function (selfcb) 
		{
			//if(msg.DDT != 'State Change')
			{
				MongoClient.connect(Mongourl, function(err, db) {
				if (err) throw err;
				var dbo = db.db("smart-light");
				dbo.collection("live_data").deleteMany({"SN":msg.SN});
				dbo.collection("live_data").insertOne(msg, function(err, res)
				{
					if( err || !res ) 
					{
						logger.error("Street Light Client Live data not updated"+err);
						selfcb(err);
					}
					else 
					{
					//	logger.info("Live data updated");
						selfcb(null,res);
					}
				});
				db.close();
			//	MongoClient.close();
				});
			}
        },
        saveParsedData: function (selfcb) 
		{
			MongoClient.connect(Mongourl, function(err, db) {
			if (err) throw err;
			var dbo = db.db("smart-light");
			dbo.collection("history").insertOne(msg, function(err, res)
			{
                if( err || !res ) 
				{
                    logger.error("Street Light Client history data not updated"+err);
                    selfcb(err);
                }
                else 
				{
                  //  logger.info("history data updated");
                    selfcb(null,res);
                }
            });
			db.close();
		//	MongoClient.close();
			});
        },
		updateTodayData: function (selfcb) 
		{  
			if(msg.DDT != 'State Change')
			{
				MongoClient.connect(Mongourl, function(err, db) {
				if (err) throw err;
				var dbo = db.db("smart-light");
				dbo.collection("today_data").insertOne(msg, function(err, res)
				{
					if( err || !res ) 
					{
						logger.error("Street Light Client today data not updated",err,res);
						selfcb(err);
					}
					else 
					{
					//	logger.info("Street Light Client today data updated");
						selfcb(null,res);
					}
				}); 
				db.close();
		//		MongoClient.close();
				});
			}
			else
			{
				selfcb(null);
			}
        }
/*		updateSiteLiveData: function (selfcb) 
		{	
			if(msg.DDT != 'State Change')
			{
				var DeviceIndex = SiteWiseData.findIndex(k => k.siteName==msg.siteName);
				console.log('Index'+DeviceIndex);
				if(DeviceIndex > -1)
				{
					SiteWiseData[DeviceIndex].ts = msg._id.ts;
					SiteWiseData[DeviceIndex].SV = (SiteWiseData[DeviceIndex].SV + msg.SV)/2;
					SiteWiseData[DeviceIndex].SC = (SiteWiseData[DeviceIndex].SC + msg.SC)/2;
					SiteWiseData[DeviceIndex].BV = (SiteWiseData[DeviceIndex].BV + msg.BV)/2;
					SiteWiseData[DeviceIndex].BC = (SiteWiseData[DeviceIndex].BC + msg.BC)/2;
					SiteWiseData[DeviceIndex].EGeneration = SiteWiseData[DeviceIndex].EGeneration + msg.EGeneration ;
					SiteWiseData[DeviceIndex].EGeneration =SiteWiseData[DeviceIndex].EGeneration + msg.EConsumption;
					db.collection('site_wise_data').save(Message, function(err, res) 
					{
						if( err || !res ) 
						{
							logger.error("Street Light Client Site Avg Live data not updated");
							selfcb(err);
						}
						else 
						{
		//							logger.info("Street Light Client Site Avg Live data updated");
						//	GetSiteWiseData();
							selfcb(null,res);
						}
					});
				}
				else if(DeviceIndex == -1)
				{
					logger.error("Street Light Client SiteData not avaliable",err,respos);
					var Message = {}
					//Message._id = respos._id;
					Message.siteName = msg.siteName;
					Message.gatewayName = msg.gatewayName;
					Message.solution = msg.solution;
					Message.deviceName = msg.deviceName;
					Message.latitude = msg.latitude;
					Message.longitude = msg.longitude;
					Message.address = msg.address;
					Message.Solution = msg.Solution;
					Message.AppId = msg.AppId;
					Message.ts = msg._id.ts;
					Message.SV = (msg.SV);
					Message.SC = (msg.SC);
					Message.BV = (msg.BV);
					Message.BC = (msg.BC);
					Message.EGeneration =  msg.EGeneration;
					Message.EConsumption = msg.EConsumption;
				//	console.log(Message);
				//	db.collection('site_wise_data').remove( {"siteName":Message.siteName});
					db.collection('site_wise_data').save(Message, function(err, res) 
					{
						if( err || !res ) 
						{
							logger.error("Street Light Client Site Avg Live data not updated");
							selfcb(err);
						}
						else 
						{
		//							logger.info("Street Light Client Site Avg Live data updated");
							GetSiteWiseData();
							selfcb(null,res);
						}
					});
				}
			}
			else
			{
				selfcb(null);
			}
		} */
	}, function (err, result) {
			logger.info("Street Light Client DATA Updated for Device:"+msg.SN+"\tDDT:"+msg.DDT+"\ttime :",moment(msg.ts).format('MM/DD/YYYY HH:mm:ss'));
		});
	
	CompleteFlag = 0;
	
}

var SaveRawDataToDB = function(msg)
{
	async.series(
	{
        saveRawData: function (selfcb) 
		{        
            db.collection('raw_data').save(Rawdata, function(err, res) 
			{
                if( err || !res ) 
				{
                    console.log("raw data not updated",err,res);
                    selfcb(err);
                }
                else 
				{
                    console.log("Raw data updated");
                    selfcb(null,res);
                }
			});   
        }
	});
	CompleteFlag = 0;
}



/*
//start sending
var i = 0;
setInterval(
    function(){
        var message = i.toString();
        console.log("sending ", message)
        client.publish("test/arun/test", message, {qos: 2}, function(){
            console.log("sent ", message)
        });
        i += 1;
    },
3000) */

