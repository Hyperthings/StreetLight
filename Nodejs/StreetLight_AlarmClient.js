



//require('@risingstack/trace');

// your application's code

// required modules
var mongojs = require('mongojs');
var moment = require('moment');
var async = require('async');
//var Sync = require('sync');
//var await = require('await');
var _ = require('underscore');
var cron = require('node-cron');
var mqtt = require('mqtt');
var fifo = require('fifo')()
var MailQ = require('fifo')()
var nodemailer = require('nodemailer');
var logger = require("./logger");
var db = mongojs('localhost:12345/smart-light');
//var db = mongojs('192.168.0.155:12345/smart-light');
//var url = "mqtt://iot.hyperthings.in";
var url = "mqtt://localhost";
var Rawdata = {};
var DeviceDetails = {};
var settings = {
	port : 6024,
    clientId: '0f238232-d2b6-4674-875a-cb811accce7d',
	username: 'htsuser',
	password: 'hts@123',
    clean: true,
    reconnectPeriod: 2000 * 1,
	rejectUnauthorized: false
}

var transporter = nodemailer.createTransport({
                                    host: 'mail.hyperthings.in',
                                    port: 587,
                                    auth: {
                                        user: 'notification@hyperthings.in',
                                        pass: 'Things@017'
                                    },            
                                    authMethod:'NTLM',
                                    secure:false,
                                    tls: {rejectUnauthorized: false},
                                    debug:true
                                });
								
var client  = mqtt.connect(url,settings);

 client.on('connect', function () {
	logger.info("*******Client Connected*******")
   client.subscribe("HTS/+/Data/Live", { qos: 0 });
   GetDeviceDetails();
});

client.on('message', function (topic, message) {
  //saveData(message.toString());
  fifo.push(message.toString())
  
});

client.on("error", function(error) {
    logger.error("ERROR: ", error);
});

client.on('offline', function() {
    logger.error("offline");
});

client.on('reconnect', function() {
    logger.error("reconnect");
});
var GetDeviceDetails= function(msg)
{
	//console.log("GetDeviceDetails");
	db.collection('device_details').find({}, function(err, respos)
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
	});
}
setInterval(
    function(){
        if(fifo.length > 0)
		{
			//console.log();
			saveData(fifo.pop());
			
		}
    },
2000) 
setInterval(
    function(){
        if(MailQ.length > 0)
		{
			//console.log();
			SendMail(MailQ.pop());
			
		}
    },
1000) 

setInterval(
    function(){
       GetDeviceDetails();
    },
1000 * 20) 

var saveData = function(msg)
{	
//	console.log(JSON.parse(msg));
	var DeviceDetail = {};
	var data = {}
	var Message = {}
	data = JSON.parse(msg);
    var currentConfiguredData = {};
	Rawdata = data;
//	data.ts = data.ts +19800;
	if(data.DDT == 'State Change')
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
					
					if((d.getHours() > 6 && d.getHours() < 18))
					{
						Message.EGeneration = ((data.BV/1000) * (data.BC/1000)) /1000;
						Message.EConsumption= 0;
					//	console.log("Energy Generation  "+Message.EGeneration);
					}
					else if((d.getHours() > 18 && (d.getHours() < 24 || d.getHours() < 6)))
					{
						Message.EConsumption = ((data.BV/1000) * (data.BC/1000))/1000;
						Message.EGeneration = 0;
					//	console.log("Energy Consumption  "+Message.EConsumption);
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
}

var SaveDataToDB = function(msg)
{	
	let query = {}
	var PrevLiveValue = {}
	var AlarmledHealth = {}
	var AlarmRTCHealth = {}
	var AlarmSolarHealth = {}
	var AlarmBatteryHealth = {}
	var AlarmDeviceTamper = {}
	var AlarmLDRHealth = {}
	var AlarmTamper = {}
	var AlarmledHealthFlag =0;
	var AlarmRTCHealthFlag =0;
	var AlarmSolarHealthFlag =0;
	var AlarmBatteryHealthFlag =0;
	var AlarmDeviceTamperFlag =0;
	var AlarmLDRHealthFlag =0;
	var AlarmTamperFlag =0;
	var PrevAlarmData = {}
	var i,l;
//	var account = {to:"darshan.ny@hyperthings.in",ts:moment(msg.ts).format('DD/MM/YYYY HH:mm:ss')}
	async.series(
	{
        getLiveData: function (selfcb) 
		{        
				db.collection('Alarm_Live').findOne({"SN" : msg.SN}, function(err, respos)
				{
                    if( err || !respos ) 
					{
                        logger.error("Street Light Alarm live data not found",err,respos);
						PrevLiveValue = msg;
                        selfcb(err);
                    }
                    else 
					{
						PrevLiveValue = respos;
						 selfcb(null,respos);
				//		 console.log(respos);
					}
            });   
        },
		updateLiveData: function (selfcb) 
		{			
			db.collection('Alarm_Live').remove( {"SN":msg.SN});
			db.collection('Alarm_Live').save(msg, function(err, res) 
			{
				if( err || !res ) 
				{
					logger.error("Street Light Alarm Live data not updated");
					selfcb(err);
				}
				else 
				{
					logger.info("Live data updated");
					selfcb(null,res);
				}
			});   
        },
		checkledHealth: function (selfcb) 
		{
			if(PrevLiveValue.ledHealth != msg.ledHealth)
			{	
				AlarmledHealth.alarmId = 102;
				AlarmledHealth.alarmName = 'LED Health';
				AlarmledHealth.siteName = msg.siteName;
				AlarmledHealth.deviceName = msg.deviceName;
				AlarmledHealth.deviceId = msg._id.deviceId;
				AlarmledHealth.severity = 'Major';
				AlarmledHealth.isAssigned = false;
				AlarmledHealth.value = msg.ledHealth;
				AlarmledHealth.gatewayId = msg.gatewayId;
				AlarmledHealth.gatewayName = msg.gatewayName;
				
				if(msg.ledHealth == 0)
				{
					AlarmledHealth.description = 'LED Health Error';
					AlarmledHealth.status = 'Open';
					AlarmledHealth.occuredTime = msg._id.ts;
					AlarmledHealth.clearedTime = '-';
					db.collection('alarm_history').save(AlarmledHealth, function(err, res) 
					{
						if( err || !res ) 
						{
							logger.error("Street Light Alarm data not updated");
							//selfcb(err);
						}
						else 
						{
							logger.info("Street Light Alarm data updated");
							//selfcb(null,res);
						}
					
					});
					MailQ.push(AlarmledHealth);		
					
				}
				else
				{
					async.series(
					{
						getPrevAlarmData: function (selfcb) 
						{
							db.collection('alarm_history').findOne({"deviceId" : msg.SN,'alarmId':AlarmledHealth.alarmId,'status':'Open'}, function(err, res1)
							{
								if( err || !res1 ) 
								{
									logger.error("Street Light Alarm no Histray Data found",err,res1);
									AlarmledHealth.occuredTime = 0;
									AlarmledHealth.clearedTime = msg._id.ts; 
									AlarmledHealth.description = 'LED Health OK';
									AlarmledHealth.status = 'Close';
									AlarmledHealthFlag = 1;
									selfcb(err);
								}
								else 
								{
//									console.log(res1);
									PrevAlarmData = res1;
									AlarmledHealth.occuredTime = res1.occuredTime;
									AlarmledHealth.clearedTime = msg._id.ts; 
									AlarmledHealth.description = 'LED Health OK';
									AlarmledHealth.status = 'Close';
									AlarmledHealthFlag = 0;
									selfcb(null,res1);
								}
							});
						},
						UpdateAlarmData: function (selfcb)
						{
							if(!AlarmledHealth.occuredTime)
							{
								AlarmledHealth.occuredTime = 0;
							}
							if(AlarmledHealthFlag == 1)
							{
								db.collection('alarm_history').update({"deviceId" : msg.SN,'alarmId':AlarmledHealth.alarmId,'status':'Open'}, {"$set": AlarmledHealth}, {upsert:true}, function(err,res)
								{
									if( err || !res ) 
									{
										logger.error("Street Light Alarm data not updated");
										selfcb(err);
									}
									else 
									{
										logger.info("Street Light Alarm data updated");
										selfcb(null,res);
									}
								});
							}
							else
							{
								db.collection('alarm_history').update({"deviceId" : msg.SN,'alarmId':AlarmledHealth.alarmId,'status':'Open'}, {"$set": { 'status':'Close','clearedTime':msg._id.ts,'description':AlarmledHealth.description}}, {upsert:false}, function(err,res)
								{
									if( err || !res ) 
									{
										logger.error("Street Light Alarm data not updated");
										selfcb(err);
									}
									else 
									{
										logger.info("Street Light Alarm data updated");
										selfcb(null,res);
									}
								});
							}
						}
//						SendMail: function (selfcb)
//						{
//							MailQ.push(AlarmledHealth);			
//							selfcb(null);
//						}
					});
				}			
				logger.info("Street Light new Alarm");
				logger.info(AlarmledHealth);
//				 emailService.sendAlarm(account);
				
			}
			selfcb(null);
		},
		checkRTCHealth: function (selfcb) 
		{
			if(PrevLiveValue.RTCHealth != msg.RTCHealth)
			{
				AlarmRTCHealth.alarmId = 108;
				AlarmRTCHealth.alarmName = 'RTC Health';
				AlarmRTCHealth.siteName = msg.siteName;
				AlarmRTCHealth.deviceName = msg.deviceName;
				AlarmRTCHealth.deviceId = msg._id.deviceId;
				AlarmRTCHealth.severity = 'Major';
				AlarmRTCHealth.isAssigned = false;
				AlarmRTCHealth.value = msg.RTCHealth;
				AlarmRTCHealth.gatewayId = msg.gatewayId;
				AlarmRTCHealth.gatewayName = msg.gatewayName;
				if(msg.RTCHealth == 0)
				{
					AlarmRTCHealth.description = 'RTC Health Error';
					AlarmRTCHealth.status = 'Open';
					AlarmRTCHealth.occuredTime = msg._id.ts;
					AlarmRTCHealth.clearedTime = '-';
					db.collection('alarm_history').save(AlarmRTCHealth, function(err, res) 
					{
						if( err || !res ) 
						{
							logger.error("Street Light Alarm data not updated");
							//selfcb(err);
						}
						else 
						{
							logger.info("Street Light Alarm data updated");
							//selfcb(null,res);
						}
					
					});
					MailQ.push(AlarmRTCHealth);		
				}
				else
				{
					async.series(
					{
						getPrevAlarmData: function (selfcb) 
						{
							db.collection('alarm_history').findOne({"deviceId" : msg.SN,'alarmId':AlarmRTCHealth.alarmId,'status':'Open'}, function(err, res1)
							{
								if( err || !res1 ) 
								{
									logger.error("Street Light Alarm no Histray Data found",err,res1);
									AlarmRTCHealth.occuredTime = 0;
									AlarmRTCHealth.clearedTime = msg._id.ts; 
									AlarmRTCHealth.description = 'RTC Health OK';
									AlarmRTCHealth.status = 'Close';
									AlarmRTCHealthFlag = 1;
									selfcb(err);
								}
								else 
								{
//									console.log(res1);
									PrevAlarmData = res1;
									AlarmRTCHealth.occuredTime = res1.occuredTime;
									AlarmRTCHealth.clearedTime = msg._id.ts; 
									AlarmRTCHealth.description = 'RTC Health OK';
									AlarmRTCHealth.status = 'Close';
									AlarmRTCHealthFlag = 0;
									selfcb(null,res1);
								}
							});
						},
						UpdateAlarmData: function (selfcb)
						{
							
							if(!AlarmRTCHealth.occuredTime)
							{
								AlarmRTCHealth.occuredTime = 0;
							}
							if(AlarmRTCHealthFlag == 1)
							{
								db.collection('alarm_history').update({"deviceId" : msg.SN,'alarmId':AlarmRTCHealth.alarmId,'status':'Open'}, {"$set": AlarmRTCHealth}, {upsert:true}, function(err,res)
								{
									if( err || !res ) 
									{
										logger.error("Street Light Alarm data not updated");
										selfcb(err);
									}
									else 
									{
										logger.info("Street Light Alarm data updated");
										selfcb(null,res);
									}
								});
							}
							else
							{
								db.collection('alarm_history').update({"deviceId" : msg.SN,'alarmId':AlarmRTCHealth.alarmId,'status':'Open'}, {"$set": { 'status':'Close','clearedTime':msg._id.ts,'description':AlarmRTCHealth.description}}, {upsert:false}, function(err,res)
								{
									if( err || !res ) 
									{
										logger.error("Street Light Alarm data not updated");
										selfcb(err);
									}
									else 
									{
										logger.info("Street Light Alarm data updated");
										selfcb(null,res);
									}
								});
							}
						}
//						SendMail: function (selfcb)
//						{
//							MailQ.push(AlarmRTCHealth);			
//							selfcb(null);
//						}
					});
				}			
				logger.info("Street Light new Alarm");
				logger.info(AlarmRTCHealth);				
			}
			selfcb(null);
		},
		checkSolarHealth: function (selfcb) 
		{
			if(PrevLiveValue.SolarHealth != msg.SolarHealth)
			{
				AlarmSolarHealth.alarmId = 104;
				AlarmSolarHealth.alarmName = 'Solar Health';
				AlarmSolarHealth.siteName = msg.siteName;
				AlarmSolarHealth.deviceName = msg.deviceName;
				AlarmSolarHealth.deviceId = msg._id.deviceId;
				AlarmSolarHealth.severity = 'Major';
				AlarmSolarHealth.isAssigned = false;
				AlarmSolarHealth.value = msg.SolarHealth;
				AlarmSolarHealth.gatewayId = msg.gatewayId;
				AlarmSolarHealth.gatewayName = msg.gatewayName;
				if(msg.SolarHealth == 0)
				{
					AlarmSolarHealth.description = 'Solar Health Error';
					AlarmSolarHealth.status = 'Open';
					AlarmSolarHealth.occuredTime = msg._id.ts;
					AlarmSolarHealth.clearedTime = '-';
					db.collection('alarm_history').save(AlarmSolarHealth, function(err, res) 
					{
						if( err || !res ) 
						{
							logger.error("Street Light Alarm data not updated");
							//selfcb(err);
						}
						else 
						{
							logger.info("Street Light Alarm data updated");
							//selfcb(null,res);
						}
					
					});
					MailQ.push(AlarmSolarHealth);			
					
				}
				else
				{
					async.series(
					{
						getPrevAlarmData: function (selfcb) 
						{
							db.collection('alarm_history').findOne({"deviceId" : msg.SN,'alarmId':AlarmSolarHealth.alarmId,'status':'Open'}, function(err, res1)
							{
								if( err || !res1 ) 
								{
									logger.error("Street Light Alarm no Histray Data found",err,res1);
									AlarmSolarHealth.occuredTime =  0;
									AlarmSolarHealth.clearedTime = msg._id.ts; 
									AlarmSolarHealth.description = 'Solar Health OK';
									AlarmSolarHealth.status = 'Close';
									AlarmSolarHealthFlag = 1;
									selfcb(err);
								}
								else 
								{
//									console.log(res1);
									PrevAlarmData = res1;
									AlarmSolarHealth.occuredTime = res1.occuredTime;
									AlarmSolarHealth.clearedTime = msg._id.ts; 
									AlarmSolarHealth.description = 'Solar Health OK';
									AlarmSolarHealth.status = 'Close';
									AlarmSolarHealthFlag = 0;
									selfcb(null,res1);
								}
							});
						},
						UpdateAlarmData: function (selfcb)
						{
							
							if(!AlarmSolarHealth.occuredTime)
							{
								AlarmSolarHealth.occuredTime = 0;
							}
							if(AlarmSolarHealthFlag == 1)
							{
								db.collection('alarm_history').update({"deviceId" : msg.SN,'alarmId':AlarmSolarHealth.alarmId,'status':'Open'}, {"$set": AlarmSolarHealth}, {upsert:true}, function(err,res)
								{
									if( err || !res ) 
									{
										logger.error("Street Light Alarm data not updated");
										selfcb(err);
									}
									else 
									{
										logger.info("Street Light Alarm data updated");
										selfcb(null,res);
									}
								});
							}
							else
							{
								db.collection('alarm_history').update({"deviceId" : msg.SN,'alarmId':AlarmSolarHealth.alarmId,'status':'Open'}, {"$set": { 'status':'Close','clearedTime':msg._id.ts,'description':AlarmSolarHealth.description}}, {upsert:false}, function(err,res)
								{
									if( err || !res ) 
									{
										logger.error("Street Light Alarm data not updated");
										selfcb(err);
									}
									else 
									{
										logger.info("Street Light Alarm data updated");
										selfcb(null,res);
									}
								});
							}
						}
//						SendMail: function (selfcb)
//						{
//							MailQ.push(AlarmSolarHealth);			
//							selfcb(null);
//						}
					});
				}			
				logger.info("Street Light new Alarm");
				logger.info(AlarmSolarHealth);				
			}
			selfcb(null);
		},
		checkBatteryHealth: function (selfcb) 
		{
			if(PrevLiveValue.BatteryHealth != msg.BatteryHealth)
			{
				AlarmBatteryHealth.alarmId = 105;
				AlarmBatteryHealth.alarmName = 'Battery Health ';
				AlarmBatteryHealth.siteName = msg.siteName;
				AlarmBatteryHealth.deviceName = msg.deviceName;
				AlarmBatteryHealth.deviceId = msg._id.deviceId;
				AlarmBatteryHealth.severity = 'Major';
				AlarmBatteryHealth.isAssigned = false;
				AlarmBatteryHealth.value = msg.BatteryHealth;
				AlarmBatteryHealth.gatewayId = msg.gatewayId;
				AlarmBatteryHealth.gatewayName = msg.gatewayName;
				if(msg.BatteryHealth == 0)
				{
					AlarmBatteryHealth.description = 'Battery Health Error';
					AlarmBatteryHealth.status = 'Open';
					AlarmBatteryHealth.occuredTime = msg._id.ts;
					AlarmBatteryHealth.clearedTime = '-';
					db.collection('alarm_history').save(AlarmBatteryHealth, function(err, res) 
					{
						if( err || !res ) 
						{
							logger.error("Street Light Alarm data not updated");
							//selfcb(err);
						}
						else 
						{
							logger.info("Street Light Alarm data updated");
							//selfcb(null,res);
						}
					
					});
					MailQ.push(AlarmBatteryHealth);		
					
				}
				else
				{
					async.series(
					{
						getPrevAlarmBatteryHealth: function (selfcb) 
						{
							db.collection('alarm_history').findOne({"deviceId" : msg.SN,'alarmId':AlarmBatteryHealth.alarmId,'status':'Open'}, function(err, res1)
							{
								if( err || !res1 ) 
								{
									logger.error("Street Light Alarm no Histray Data found",err,res1);
									AlarmBatteryHealth.occuredTime = 0;
									AlarmBatteryHealth.clearedTime = msg._id.ts; 
									AlarmBatteryHealth.description = 'Battery Health OK';
									AlarmBatteryHealth.status = 'Close';
									AlarmBatteryHealthFlag = 1;
									selfcb(err);
								}
								else 
								{
//									console.log(res1);
									PrevAlarmData = res1;
									AlarmBatteryHealth.occuredTime = res1.occuredTime;
									AlarmBatteryHealth.clearedTime = msg._id.ts; 
									AlarmBatteryHealth.description = 'Battery Health OK';
									AlarmBatteryHealth.status = 'Close';
									AlarmBatteryHealthFlag = 0;
									selfcb(null,res1);
								}
							});
						},
						UpdateAlarmData: function (selfcb)
						{
							
							if(!AlarmBatteryHealth.occuredTime)
							{
								AlarmBatteryHealth.occuredTime = 0;
							}
							if(AlarmBatteryHealthFlag == 1)
							{
								db.collection('alarm_history').update({"deviceId" : msg.SN,'alarmId':AlarmBatteryHealth.alarmId,'status':'Open'}, {"$set": AlarmBatteryHealth}, {upsert:true}, function(err,res)
								{
									if( err || !res ) 
									{
										logger.error("Street Light Alarm data not updated");
										selfcb(err);
									}
									else 
									{
										logger.info("Street Light Alarm data updated");
										selfcb(null,res);
									}
								});
							}
							else
							{
								db.collection('alarm_history').update({"deviceId" : msg.SN,'alarmId':AlarmBatteryHealth.alarmId,'status':'Open'}, {"$set": { 'status':'Close','clearedTime':msg._id.ts,'description':AlarmBatteryHealth.description}}, {upsert:false}, function(err,res)
								{
									if( err || !res ) 
									{
										logger.error("Street Light Alarm data not updated");
										selfcb(err);
									}
									else 
									{
										logger.info("Street Light Alarm data updated");
										selfcb(null,res);
									}
								});
							}
						}
//						SendMail: function (selfcb)
//						{
//							MailQ.push(AlarmBatteryHealth);			
//							selfcb(null);
//						}
					});
				}			
				logger.info("Street Light new Alarm");
				logger.info(AlarmBatteryHealth);				
			}
			selfcb(null);
		},
		checkDeviceHealth: function (selfcb) 
		{
			if(PrevLiveValue.DeviceTamper != msg.DeviceTamper)
			{
				AlarmDeviceTamper.alarmId = 106;
				AlarmDeviceTamper.alarmName = 'Device tamper Health';
				AlarmDeviceTamper.siteName = msg.siteName;
				AlarmDeviceTamper.deviceName = msg.deviceName;
				AlarmDeviceTamper.deviceId = msg._id.deviceId;
				AlarmDeviceTamper.severity = 'Major';
				AlarmDeviceTamper.isAssigned = false;
				AlarmDeviceTamper.value = msg.DeviceTamper;
				AlarmDeviceTamper.gatewayId = msg.gatewayId;
				AlarmDeviceTamper.gatewayName = msg.gatewayName;
				if(msg.DeviceTamper == 0)
				{
					AlarmDeviceTamper.description = 'Device tamper Error';
					AlarmDeviceTamper.status = 'Open';
					AlarmDeviceTamper.occuredTime = msg._id.ts;
					AlarmDeviceTamper.clearedTime = '-';
					db.collection('alarm_history').save(AlarmDeviceTamper, function(err, res) 
					{
						if( err || !res ) 
						{
							logger.error("Street Light Alarm data not updated");
							//selfcb(err);
						}
						else 
						{
							logger.info("Street Light Alarm data updated");
							//selfcb(null,res);
						}
					
					});
					MailQ.push(AlarmDeviceTamper);		
					
				}
				else
				{
					async.series(
					{
						getPrevAlarmData: function (selfcb) 
						{
							db.collection('alarm_history').findOne({"deviceId" : msg.SN,'alarmId':AlarmDeviceTamper.alarmId,'status':'Open'}, function(err, res1)
							{
								if( err || !res1 ) 
								{
									logger.error("Street Light Alarm no Histray Data found",err,res1);
									AlarmDeviceTamper.occuredTime = 0;
									AlarmDeviceTamper.clearedTime = msg._id.ts; 
									AlarmDeviceTamper.description = 'Device tamper OK';
									AlarmDeviceTamper.status = 'Close';
									AlarmDeviceTamperFlag = 1;
									selfcb(err);
								}
								else 
								{
//									console.log(res1);
									
									PrevAlarmData = res1;
									AlarmDeviceTamper.occuredTime = res1.occuredTime;
									AlarmDeviceTamper.clearedTime = msg._id.ts; 
									AlarmDeviceTamper.description = 'Device tamper OK';
									AlarmDeviceTamper.status = 'Close';
									AlarmDeviceTamperFlag = 0;
									selfcb(null,res1);
								}
							});
						},
						UpdateAlarmData: function (selfcb)
						{
							if(!AlarmDeviceTamper.occuredTime)
							{
								AlarmDeviceTamper.occuredTime = 0;
							}
							if(AlarmDeviceTamperFlag == 1)
							{
								db.collection('alarm_history').update({"deviceId" : msg.SN,'alarmId':AlarmDeviceTamper.alarmId,'status':'Open'}, {"$set": AlarmDeviceTamper}, {upsert:true}, function(err,res)
								{
									if( err || !res ) 
									{
										logger.error("Street Light Alarm data not updated");
										selfcb(err);
									}
									else 
									{
										logger.info("Street Light Alarm data updated");
										selfcb(null,res);
									}
								});
							}
							else
							{
								db.collection('alarm_history').update({"deviceId" : msg.SN,'alarmId':AlarmDeviceTamper.alarmId,'status':'Open'}, {"$set": { 'status':'Close','clearedTime':msg._id.ts,'description':AlarmDeviceTamper.description}}, {upsert:false}, function(err,res)
								{
									if( err || !res ) 
									{
										logger.error("Street Light Alarm data not updated");
										selfcb(err);
									}
									else 
									{
										logger.info("Street Light Alarm data updated");
										selfcb(null,res);
									}
								});
							}
						}
//						SendMail: function (selfcb)
//						{
//							MailQ.push(AlarmDeviceTamper);		
//						}
					});
				}			
				logger.info("Street Light new Alarm");
				logger.info(AlarmDeviceTamper);				
			}
			selfcb(null);
		 },
		checkLDRHealth: function (selfcb) 
		{
			if(PrevLiveValue.LDRHealth != msg.LDRHealth)
			{
				AlarmLDRHealth.alarmId = 107;
				AlarmLDRHealth.alarmName = 'LDR Health';
				AlarmLDRHealth.siteName = msg.siteName;
				AlarmLDRHealth.deviceName = msg.deviceName;
				AlarmLDRHealth.deviceId = msg._id.deviceId;
				AlarmLDRHealth.severity = 'Major';
				AlarmLDRHealth.isAssigned = false;
				AlarmLDRHealth.value = msg.LDRHealth;
				AlarmLDRHealth.gatewayId = msg.gatewayId;
				AlarmLDRHealth.gatewayName = msg.gatewayName;
				if(msg.LDRHealth == 0)
				{
					AlarmLDRHealth.description = 'LDR Health Error';
					AlarmLDRHealth.status = 'Open';
					AlarmLDRHealth.occuredTime = msg._id.ts;
					AlarmLDRHealth.clearedTime = '-';
					db.collection('alarm_history').save(AlarmLDRHealth, function(err, res) 
					{
						if( err || !res ) 
						{
							logger.error("Street Light Alarm data not updated");
							//selfcb(err);
						}
						else 
						{
							logger.info("Street Light Alarm data updated");
							//selfcb(null,res);
						}
					
					});
					MailQ.push(AlarmLDRHealth);		
					
				}
				else
				{
					async.series(
					{
						getPrevAlarmData: function (selfcb) 
						{
							db.collection('alarm_history').findOne({"deviceId" : msg.SN,'alarmId':AlarmLDRHealth.alarmId,'status':'Open'}, function(err, res1)
							{
								if( err || !res1 ) 
								{
									logger.error("Street Light Alarm no Histray Data found",err,res1);
									AlarmLDRHealth.occuredTime = 0;
									AlarmLDRHealth.clearedTime = msg._id.ts; 
									AlarmLDRHealth.description = 'LDR Health OK';
									AlarmLDRHealth.status = 'Close';
									AlarmLDRHealthFlag = 1;
									selfcb(err);
								}
								else 
								{
//									console.log(res1);
									PrevAlarmData = res1;
									AlarmLDRHealth.occuredTime = res1.occuredTime;
									AlarmLDRHealth.clearedTime = msg._id.ts; 
									AlarmLDRHealth.description = 'LDR Health OK';
									AlarmLDRHealth.status = 'Close';
									AlarmLDRHealthFlag = 0;
									selfcb(null,res1);
								}
							});
						},
						UpdateAlarmData: function (selfcb)
						{
							
							if(!AlarmLDRHealth.occuredTime)
							{
								AlarmLDRHealth.occuredTime = 0;
							}
							if(AlarmLDRHealthFlag == 1)
							{
								db.collection('alarm_history').update({"deviceId" : msg.SN,'alarmId':AlarmLDRHealth.alarmId,'status':'Open'}, {"$set": AlarmLDRHealth}, {upsert:true}, function(err,res)
								{
									if( err || !res ) 
									{
										logger.error("Street Light Alarm data not updated");
										selfcb(err);
									}
									else 
									{
										logger.info("Street Light Alarm data updated");
										selfcb(null,res);
									}
								});
							}
							else
							{
								db.collection('alarm_history').update({"deviceId" : msg.SN,'alarmId':AlarmLDRHealth.alarmId,'status':'Open'}, {"$set": { 'status':'Close','clearedTime':msg._id.ts,'description':AlarmLDRHealth.description}}, {upsert:false}, function(err,res)
								{
									if( err || !res ) 
									{
										logger.error("Street Light Alarm data not updated");
										selfcb(err);
									}
									else 
									{
										logger.info("Street Light Alarm data updated");
										selfcb(null,res);
									}
								});
							}
						}
//						SendMail: function (selfcb)
//						{
//							MailQ.push(AlarmLDRHealth);				
//							selfcb(null);
//						}
					});
				}			
				logger.info("Street Light new Alarm");
				logger.info(AlarmLDRHealth);				
			}
			selfcb(null);
		 },
		checkTamper: function (selfcb) 
		{
			if(PrevLiveValue.Tamper != msg.Tamper)
			{
				AlarmTamper.alarmId = 108;
				AlarmTamper.alarmName = 'Tamper';
				AlarmTamper.siteName = msg.siteName;
				AlarmTamper.deviceName = msg.deviceName;
				AlarmTamper.deviceId = msg._id.deviceId;
				AlarmTamper.severity = 'Major';
				AlarmTamper.isAssigned = false;
				AlarmTamper.value = msg.Tamper;
				AlarmTamper.gatewayId = msg.gatewayId;
				AlarmTamper.gatewayName = msg.gatewayName;
				if(msg.Tamper == 0)
				{
					AlarmTamper.description = 'Tamper Error';
					AlarmTamper.status = 'Open';
					AlarmTamper.occuredTime = msg._id.ts;
					AlarmTamper.clearedTime = '-';
					db.collection('alarm_history').save(AlarmTamper, function(err, res) 
					{
						if( err || !res ) 
						{
							logger.error("Street Light Alarm data not updated");
							//selfcb(err);
						}
						else 
						{
							logger.info("Street Light Alarm data updated");
							//selfcb(null,res);
						}
					
					});
					MailQ.push(AlarmTamper);		
					
				}
				else
				{
					async.series(
					{
						getPrevAlarmData: function (selfcb) 
						{
							db.collection('alarm_history').findOne({"deviceId" : msg.SN,'alarmId':AlarmTamper.alarmId,'status':'Open'}, function(err, res1)
							{
								if( err || !res1 ) 
								{
									logger.error("Street Light Alarm no Histray Data found",err,res1);
									AlarmTamper.occuredTime = 0;
									AlarmTamper.clearedTime = msg._id.ts; 
									AlarmTamper.description = 'Tamper OK';
									AlarmTamper.status = 'Close';
									AlarmTamperFlag = 1;
									selfcb(err);
								}
								else 
								{
//									console.log(res1);
									PrevAlarmData = res1;
									AlarmTamper.occuredTime = res1.occuredTime;
									AlarmTamper.clearedTime = msg._id.ts; 
									AlarmTamper.description = 'Tamper OK';
									AlarmTamper.status = 'Close';
									AlarmTamperFlag = 0;
									selfcb(null,res1);
								}
							});
						},
						UpdateAlarmData: function (selfcb)
						{
							if(!AlarmTamper.occuredTime)
							{
								AlarmTamper.occuredTime = 0;
							}
							if(AlarmTamperFlag == 1)
							{
								db.collection('alarm_history').update({"deviceId" : msg.SN,'alarmId':AlarmTamper.alarmId,'status':'Open'}, {"$set": AlarmTamper}, {upsert:true}, function(err,res)
								{
									if( err || !res ) 
									{
										logger.error("Street Light Alarm data not updated");
										selfcb(err);
									}
									else 
									{
										logger.info("Street Light Alarm data updated");
										selfcb(null,res);
									}
								});
							}
							else
							{
								db.collection('alarm_history').update({"deviceId" : msg.SN,'alarmId':AlarmTamper.alarmId,'status':'Open'}, {"$set": { 'status':'Close','clearedTime':msg._id.ts,'description':AlarmTamper.description}}, {upsert:false}, function(err,res)
								{
									if( err || !res ) 
									{
										logger.error("Street Light Alarm data not updated");
										selfcb(err);
									}
									else 
									{
										logger.info("Street Light Alarm data updated");
										selfcb(null,res);
									}
								});
							}
						}
//						SendMail: function (selfcb)
//						{
//							MailQ.push(AlarmTamper);		
//							selfcb(null);
//						}
					});
				}			
				logger.info("Street Light new Alarm");
				logger.info(AlarmTamper);				
			}
			selfcb(null);

		}
	});
}

var SendMail = function(AlarmData)
{
	var mailOptions = {
									  from: 'notification@hyperthings.in',
									  to: 's.sudhan@hyperthings.in,kruttika@evolute.in',
									  subject: 'New Alarm',
										html:"<html><body>Hi,<br><br>New Alarm Generated from,</b><br><br>Site ID : "+ AlarmData.siteName +"</a><br><br>Device Name :"+AlarmData.deviceName+"</a><br><br>Device Serial No :"+AlarmData.deviceId+"</a><br><br>TimeStamp : '"+moment()._d+"</a><br><br>Description : "+AlarmData.description+" </a><br><br>Severity : Critical</a><br><br>Thanks,<br>Service Team<br><br></body></html>"};
									transporter.sendMail(mailOptions, function(error, info){
									if (error) {	logger.error(error);	} else {
									logger.info('Email sent: ' + info.response); } });		
}
//cron.schedule('59 23 * * *', function(){
  //checkForAlarm()
//});

//var alarmvalue = 80;
//
//var checkForAlarm = function(){
//	
//			db.collection('pressure_data').find({},{_id:0}).sort({ts: -1}).limit(1, function(err, res) {
//                if( err || !res ) {
//        
//                    console.log("ERROR:",err);
//                }
//                else {
//					console.log("RES:",res);
//                    if (Number(res[0].pressure) > Number(80)) {
//						saveData(res[0]);
//					}
//                    
//                }
//
//            });
//	
//}
//
//checkForAlarm();
//

//var saveData = function(data)
//{
//	console.log(data);
//	 var html1 = "<html><body>";
//        html1 += "Hi,<br><br>";
//        html1 += "New Alarm Generated from,</b><br><br>";
//        html1 += "Site ID : "+data.siteName+"</a><br><br>";
//		html1 += "Device Name :"+data.deviceName+"</a><br><br>";
//		html1 += "Device Serial No :"+data.deviceId+"</a><br><br>";
//		html1 += "TimeStamp : '"+moment()._d+"'</a><br><br>";
//		html1 += "Description : "+data.alarmName+" </a><br><br>";
//		html1 += "Severity : Critical</a><br><br>";
//        html1 += "Thanks,<br>";
//        html1 += "Service Team<br><br>";
//        html1 += "</body></html>";
//	var mailOptions = {
//  from: 'notification@hyperthings.in',
//  to: 'darshan.ny@hyperthings.in',
//  subject: 'New Alarm',
//  html:html1
////   html:"<html><body>Hi,<br><br>New Alarm Generated from,</b><br><br>Site ID : "+ data.siteName +"</a><br><br>Device Name :"+data.deviceName+"</a><br><br>Device Serial No :"+data.deviceId+"</a><br><br>TimeStamp : '"+moment()._d+"Description : "+data.alarmName+" </a><br><br>Severity : Critical</a><br><br>Thanks,<br>Service Team<br><br></body></html>"
//};
//
//transporter.sendMail(mailOptions, function(error, info){
//  if (error) {
//    console.log(error);
//  } else {
//    console.log('Email sent: ' + info.response);
//  }
//});
//}

//var saveData = function(msg){
//    
//    //var account = {to:"arun@hyperthings.in",ts:moment(msg.ts).format('DD/MM/YYYY HH:mm:ss')}
//	var account = {to:"darshan.ny@hyperthings.in",ts:moment(msg.ts).format('DD/MM/YYYY HH:mm:ss')}
//    async.series({
//
//        updateAlarmData: function (selfcb) {
//                
//                db.collection('alarm_history').insert(msg, function(err, res) {
//                    if( err || !res ) {
//                        
//                         selfcb(err);
//                    }
//                    else {
//                        //console.log("today data updated");
//                         selfcb(null,res);
//                    }
//
//                });
//               
//        },
//        
//        
//         updateLiveData: function (selfcb) {
//			 
//              
//			   emailService.sendAlarm(account);
//			   selfcb(null);
//        },
//
//    }, function (err, result) {
//        console.log("DATA Updated for :",moment(msg.ts).format('MM/DD/YYYY HH:mm:ss'));
//    });
//}
    
    
//    
//}
//
//
//
///*
////start sending
//var i = 0;
//setInterval(
//    function(){
//        var message = i.toString();
//        console.log("sending ", message)
//        client.publish("test/arun/test", message, {qos: 2}, function(){
//            console.log("sent ", message)
//        });
//        i += 1;
//    },
//3000) */
//
////