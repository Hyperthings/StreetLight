



//require('@risingstack/trace');

// your application's code

// required modules
var mongojs = require('mongojs');
var moment = require('moment');
var async = require('async');
var _ = require('underscore');
var cron = require('node-cron');
var emailService = require('./email.js');
//var db = mongojs('192.168.0.159:27017/asset-performance');
var db = mongojs('iot.hyperthings.in:12345/asset-performance');

var alarmTS = moment()._d;

 
cron.schedule('*/2 * * * * *', function(){
	console.log("Job Running at :",moment().format('MM/DD/YYYY HH:mm:ss'));
  checkForAlarm()
});


var checkForAlarm = function(){
	
			db.collection('pressure_data').find({},{_id:0}).sort({ts: -1}).limit(1, function(err, res) {
                if( err || !res ) {
        
                    console.log("ERROR:",err);
                }
                else {
					
                    if (Number(res[0].rul) <= Number(40)) {
						console.log("Alarm Found:",res);
						if(moment(alarmTS).isSame(res[0].ts)){
							  console.log("DATE ERROR: Alarm Already Generated for this event");
						}else{
							saveData(res[0]);
						}
						
					}
                    
                }

            });
	
}

//checkForAlarm();

var saveData = function(msg){
	alarmTS = msg.ts;
    var message = {};

    message.occuredTime = moment(msg.ts)._d;
	message.isAssigned = false;
    message.alarmId = "Diffusion-IEC6065";
    message.alarmName = "Low RUL";
    message.severity = "Critical";
    message.description = "RUL value is Low";
    message.clearedTime = "-";
    message.status = "Open";
     var account = {to:"s.sudhan@hyperthings.in",subject : "New Alarm Occurred" ,ts:moment(msg.ts).format('DD/MM/YYYY HH:mm:ss')}
    async.series({

        updateAlarmData: function (selfcb) {
                
                db.collection('alarm_history').insert(message, function(err, res) {
                    if( err || !res ) {
                        
                         selfcb(err);
                    }
                    else {
                        //console.log("today data updated");
                         selfcb(null,res);
                    }

                });
               
        },
        
        
         updateLiveData: function (selfcb) {
			 
              
			   emailService.sendAlarm(account);
			   selfcb(null);
        },

    }, function (err, result) {
        console.log("DATA Updated for :",moment(message.ts).format('MM/DD/YYYY HH:mm:ss'));
    });
    
    
    
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

