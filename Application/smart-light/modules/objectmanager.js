var ObjectManager = function () {}

var databaseUrl = "localhost:12345/smart-light"; // "username:password@example.com/mydb"
var collections = ["devices","parking_occupancy","test","live_data","area_comparison"]
var mongojs = require('mongojs');
var moment = require('moment');
var db = mongojs(databaseUrl, collections)
var dataformatter = require('./data_formatter.js');
var emailService = require('./../email.js');
var mqtt_publisher = require('./mqtt_publisher.js')
//var db = require("mongojs").connect(databaseUrl, collections);

ObjectManager.prototype.saveObject = function (req, res) {
   

   let objType = req.params.objectType, 
    objValue = req.body;

  /* if(objType == 'gateway_details'){
        status = 'New Gateway'
   }else if(objType == 'device_details'){
    status = 'New Device'
   }*/
   if(objValue.inchargePersonMail){
        var account = {to:objValue.inchargePersonMail, info: objValue, subject : "Alarm Assigned" ,ts:moment().format('DD/MM/YYYY HH:mm:ss')} //.format('DD/MM/YYYY HH:mm:ss')
        emailService.sendAlarm(account);
   }
   
    if (objValue._id == undefined) {


        if (objType == 'device_details') {
            //console.log('Value : ',objValue);
            //console.log('Length : ',objValue.length);
            for (obj of objValue) {
                let deviceDetailsData = {
                    
                    "_id" : {
                        "deviceId" : obj.deviceId,
                        //"ts" : moment()._d
                        "ts" : new Date(0)
                    },
                    "ts" : new Date(0),
                    "siteName" : obj.siteName,
                    "gatewayName" : obj.gatewayName,
                    "gatewayId" : obj.gatewayId,
                    "solution" : "EMS",
                    "deviceName" : obj.deviceName,
                    "deviceMacAddress" : obj.deviceMacAddress,
                    "latitude" : obj.latitude,
                    "longitude" : obj.longitude,
                    "address" : "banglore",
                    "SN" : obj.deviceId,
                    "LED" : 0,
                    "Diag" : 52,
                    "Solution" : "EMS",
                    "DDT" : "Live",
                    "AppId" : "Evolute",
                    "SV" : 0,
                    "SC" : 0,
                    "BV" : 0,
                    "BC" : 0,
                    "ledIndensity" : 0,
                    "SCStatus" : "0",
                    "lightStatus" : "0",
                    "Tamper" : "0",
                    "ledHealth" : "0",
                    "RTCHealth" : "0",
                    "SolarHealth" : "0",
                    "BatteryHealth" : "0",
                    "DeviceTamper" : "0",
                    "LDRHealth" : "0",
                    "EGeneration" : 0,
                    "EConsumption" : 0

               /* "_id" : {
                   
                    "deviceId": obj.deviceId,
                    "ts" : moment()._d
                },
                 "customer" : "HYPERTHINGS",
                    "country" : "INDIA",
                    "state" : "Karnataka",
                    "city" : "bangalore",
                    "solution" : "Smart-Light",
                    "gateway" : "HTTP",
                    "deviceType" : "Rooftop",
                    "device" : "site1",
                    "deviceName" : obj.deviceName,
                    "gatewayName" : obj.gatewayName,
                    "deviceMacAddress" : obj.deviceMacAddress,
                    "siteName" : obj.siteName,
                    "address": "Bangalore, India",
                "lat" : obj.latitude,
                "long" : obj.longitude,
                "SV" : 24.225,
                "LED" : 69,
                "BC" : 12,
                "Diag" : 49,
                "Solution" : "EMS",
                "ts" : 1524821794,
                "DDT" : "State Change",
                "BV" : 14271,
                "SN" : "123456789",
                "AppId" : "Evolute",
                "SC" : 0.22,
                "ledIndensity" : 50,
                "SolarCharging" : "0",
                "lightStatus" : "0",
                "Tamper" : "1",
                "ledHealth" : "1",
                "RTCHealth" : "0",
                "SolarHealth" : "0",
                "BatteryHelath" : "0",
                "DeviceTamper" : "1",
                "LDRHealth" : "1"*/
            }
            db['live_data'].save(deviceDetailsData, function (err, saved) {
                if (err || !saved){
                    console.log(err);
                 } 
                else {
                    console.log({message: "Live Data Added Successfully"});
                 }
            });

            }

             db['site_details'].update( { "siteName" : objValue[0].siteName },{ $inc: { 'thisSiteDevices': objValue.length} }, function (err, saved) {
                if (err || !saved){
                    console.log(err);
                 } 
                else {
                    console.log({message: "Site Data  Added Successfully"});
                 }
            });

             db['gateway_details'].update( {"gatewayName" : objValue[0].gatewayName},{ $inc: { 'thisGatewayDevices': objValue.length} }, function (err, saved) {
                if (err || !saved){
                    console.log(err);
                 } 
                else {
                    console.log({message: "Gateway Data  Added Successfully"});
                 }
            });
            
        }

        if (objType == 'site_details') {

            let lightControlData = {
                    "siteName" : objValue.siteName,
                    "firstAlarmTime" : "00:00",
                    "secondAlarmTime" : "00:00",
                    "thirdAlarmTime" : "00:00",
                    "firstAlarmIndensity" : 0,
                    "secondAlarmIndensity" : 0,
                    "thirdAlarmIndensity" : 0,
                    "pirTimeout" : "0"
                }

             db['light_controls'].save(lightControlData, function (err, saved) {
                if (err || !saved){
                    console.log(err);
                 } 
                else {
                    console.log({message: "Light Control Data Data Added Successfully"});
                 }
            });

        }


        db[objType].save(objValue, function (err, saved) {
            if (err || !saved){
                res.json({message: "Data not Added"});
             } 
            else {
                res.json({message: "Data Added Successfully"});
             }
        });

        

    }else{
       
       console.log('Update Device',objValue);
        var tmpId= objValue._id;
        delete objValue._id;

        if (objType == 'device_details') {
            let updateLiveData = {
                  "siteName" : objValue.siteName,
                  "deviceName" : objValue.deviceName,
                   "gatewayName" : objValue.gatewayName,
                   "deviceMacAddress" : objValue.deviceMacAddress,
                   "longitude" : objValue.longitude,
                   "latitude" : objValue.latitude,
                   "address" : objValue.address,
                  "solution" : objValue.solution
            }
            db['live_data'].update({"_id.deviceId": objValue.deviceId}, {$set:updateLiveData}, function (err, saved) {
                if (err || !saved){
                    console.log(err);
                 } 
                else {
                    console.log({message: "Live Data Updated Successfully"});
                 }
            })
        }
        

        db[objType].update({_id: mongojs.ObjectId(tmpId)}, objValue,{upsert: true}, function (err, saved) {
            if (err || !saved){
                
             res.json({message: "Data not Updated"});
            }
            else {
               res.json({message: "Data Updated Successfully"});
               
            }
        });
    }
}

/*ObjectManager.prototype.deleteObject = function (objType, id) {
    db[objType].remove({
        _id: id
    }, function (err, removed) {
        if (err || !removed) console.log("Object not Removed");
        else console.log("Object Removed");
    });
}*/

/*ObjectManager.prototype.deleteObject = function (objType, query, res) {
    console.log(objType, query)
    db[objType].remove(query, function (err, removed) {
        if (err || !removed) console.log("Object not Removed");
        else {
            if (removed.n = 1) {
                db['live_data'].remove(query, function (err, removed) {
                    if (err || !removed) console.log("Object not Removed");
                    else {
                        console.log('Removed from Live Data');
                    }
                })
                if (objType == 'site_details') {
                    db['light_controls'].remove(query, function (err, removed) {
                        if (err || !removed) console.log("Object not Removed");
                        else {
                            console.log('Removed from Light Controls');
                        }
                    })
                }
                res.json({statusMessage:'Successfully'})
            }else {
                res.json({statusMessage:'Unsuccessfully'})
            }
        }
    });
}*/

ObjectManager.prototype.deleteObject = function (objType, query, res) {
    console.log(objType, query)
    db[objType].remove(query, function (err, removed) {
        if (err || !removed) console.log("Object not Removed");
        else {
            if (removed.n <= 1) {
                console.log('n>>>>>>',removed);
                let initialRemovedDataCount = removed.n;
                db['live_data'].remove(query, function (err, removed) {
                    if (err || !removed) console.log("Object not Removed");
                    else {
                        console.log('Removed from Live Data');
                    }
                })
                db['device_details'].remove(query, function (err, removed) {
                    if (err || !removed) console.log("Object not Removed");
                    else {
                        console.log('Removed from Device Data',removed.n);
                        let removedDataCount = removed.n;
                        if (objType == 'device_details') {
                            removedDataCount = initialRemovedDataCount;
                        }

                        if (objType == 'device_details') {
                            db['site_details'].update({'siteName':query.siteName},{ $inc:{'thisSiteDevices':  -removedDataCount}},function(err, data){
                                if (err || !data) console.log("Object not Removed");
                                else {
                                    console.log('Successful');
                                }
                            })
                             db['gateway_details'].update({'siteName':query.siteName,'gatewayName':query.gatewayName},{ $inc: {'thisGatewayDevices':  -removedDataCount} },function(err, data){
                                if (err || !data) console.log("Object not Removed");
                                else {
                                    console.log('Successful');
                                }
                            })

                        }
                        if (objType == 'gateway_details') {
                            db['site_details'].update({'siteName':query.siteName},{ $inc: {'thisSiteDevices':  -removedDataCount} },function(err, data){
                                if (err || !data) console.log("Object not Removed");
                                else {
                                    console.log('Successful');
                                }
                            })
                        }

                    }
                })
                db['alarm_history'].remove(query, function (err, removed) {
                    if (err || !removed) console.log("Object not Removed");
                    else {
                        console.log('Removed from Alarm History');
                    }
                })
                db['assignedAlarmDetails'].remove(query, function (err, removed) {
                    if (err || !removed) console.log("Object not Removed");
                    else {
                        console.log('Removed from Assigned Alarm Details');
                    }
                })
                if (objType == 'site_details') {
                    db['light_controls'].remove(query, function (err, removed) {
                        if (err || !removed) console.log("Object not Removed");
                        else {
                            console.log('Removed from Light Controls');
                        }
                    })
                    db['gateway_details'].remove(query, function (err, removed) {
                        if (err || !removed) console.log("Object not Removed");
                        else {
                            console.log('Removed from Gateway Data');
                        }
                    })
                }
                /*if (objType == 'device_details') {
                    db['site_details'].update({'siteName':query.siteName},{ $inc:{'thisSiteDevices':  -1}},function(err, data){
                        if (err || !data) console.log("Object not Removed");
                        else {
                            console.log('Successful');
                        }
                    })
                     db['gateway_details'].update({'siteName':query.siteName,'gatewayName':query.gatewayName},{ $inc: {'thisGatewayDevices':  -1} },function(err, data){
                        if (err || !data) console.log("Object not Removed");
                        else {
                            console.log('Successful');
                        }
                    })

                }
                if (objType == 'gateway_details') {
                    db['site_details'].update({'siteName':query.siteName},{ $inc: {'thisSiteDevices':  -1} },function(err, data){
                        if (err || !data) console.log("Object not Removed");
                        else {
                            console.log('Successful');
                        }
                    })
                }*/
                res.json({statusMessage:'Successfully'})
            }else {
                res.json({statusMessage:'Unsuccessfully'})
            }
        }
    });
}

ObjectManager.prototype.getAllObjects = function (objType, callback) {
    db[objType].find({}, function (err, data) {
        if (err || !data) console.log("No data found");
        else callback(data);
    });
}

ObjectManager.prototype.getObjects = function (objType, filterField, filterValue, callback) {
    
    var query = {};
    query[filterField] = filterValue;

    db[objType].find(query, function (err, data) {

        if (err || !data) console.log("No data found");
        else callback(data);
    });
}

ObjectManager.prototype.getObjects = function (query,collectionName, callback) {

    db[collectionName].find(query, function (err, data) {

        if (err || !data) console.log("No data found");
        else callback(data);
    });
}

ObjectManager.prototype.getAttendance = function (query, callback) {
    db.attendance.find(query, function (err, data) {

        if (err || !data) console.log("No data found");
        else callback(data);
    });
}


ObjectManager.prototype.getFormattedObjects = function (query,collectionName,parameter, callback) { 
    query["ts"] =  {
        $gte: moment().startOf('day').add(6, 'hours')._d,
        $lte: moment().endOf('day').add(6, 'hours')._d
    }
    console.log('query',query);
    console.log('collectionName',collectionName);

    db[collectionName].find(query, function (err, datas) {
        if (err || !datas) console.log("No data found");
         //else callback(datas);
        else callback(dataformatter.formatData(datas,parameter));
    });
}

ObjectManager.prototype.getDistinctObjects = function (query,collectionName,parameter, callback) { 

    db[collectionName].distinct(query, {}, function (err, datas) {
        if (err || !datas) console.log("No data found");
         //else callback(datas);
        else callback(datas); //callback(dataformatter.getDistinctDatas(datas,parameter));
    });
}

ObjectManager.prototype.overallFormattedSites = function (query,collectionName,parameter, callback) { 
    /*query["ts"] =  {
        $gte: moment().startOf('day')._d,
        $lte: moment().endOf('day')._d
    }*/
    db[collectionName].find(query, function (err, datas) {
        if (err || !datas) console.log("No data found");
         //else callback(datas);
        else callback(dataformatter.overallFormattedDatas(datas,parameter));
    });
}

ObjectManager.prototype.getCounts = function (query,collectionName,parameter, callback) { 
    /*query["ts"] =  {
        $gte: moment().startOf('day')._d,
        $lte: moment().endOf('day')._d
    }*/

    db[collectionName].count(query, function (err, datas) {
        if (err || !datas) console.log("No data found");
         //else callback(datas);
        else callback(datas);
    });
}

ObjectManager.prototype.reportsData = function (query,collectionName, callback) {

    if(query['_id.ts']){
        query["_id.ts"] =  {
            $gte: moment(query['_id.ts'].startDate).startOf('day')._d,
            $lte: moment(query['_id.ts'].endDate).endOf('day')._d
        }
    }/*else {
        query["_id.ts"] = undefined;
    }*/
    console.log('query ;',query)
    db[collectionName].find(query, function (err, data) {

        if (err || !data) console.log("No data found");
        else callback(data);
    });
}


ObjectManager.prototype.registration = function (query, res, parameter, callback) { 
   
        mqtt_publisher.registerLightControl(query, res, parameter,callback);
}

ObjectManager.prototype.mqttOnlineStatus = function (query, res, parameter, callback) { 
    console.log('mqtt status object');
        mqtt_publisher.checkMqttOnlineStatus(query, res, parameter,callback);
}

module.exports = ObjectManager;