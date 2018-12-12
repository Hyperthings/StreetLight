var mongojs = require('mongojs');
var mqtt_server = require('./mqtt_server.js')
var db = mongojs('localhost:12345/smart-light');
var exports = module.exports = {};



exports.registerLightControl = function(req, res, parameter, callback){
	let client = mqtt_server.mqttClient();

	let regData = req.body.data;

    //console.log(regData);
    console.log(regData.regData.gatewayMac);
    let gatewayMacAdd = regData.regData.gatewayMac;

    let data =req.body.data.regData; 
	let topic = req.body.data.regTopic;
    let publishData = data;

    if(data.Command == "DeviceConfiguration") {
        publishData = data
    }else if( data.Command != "DeviceConfiguration" && publishData.gatewayMac){
        delete publishData.gatewayMac;
    }

	console.log('data', data,topic);
    //client.on('connect', function () {
        console.log("*******command sent*******", topic)
        client.publish(topic, JSON.stringify(publishData));
       //client.end()
    //});
  
    //client.subscribe("HTS/"+gatewayMacAdd+"/COMMAND/RESPONSE");
    //console.log("HTS/"+gatewayMacAdd+"/COMMAND/RESPONSE")

    client.on('message', function (topic, message) {
         
      console.log('received', JSON.parse(message.toString()));

     let responseData  = JSON.parse( message.toString());

     if (data.CommandID == responseData.CommandID) {
     	//console.log(data.CommandID +" "+responseData.CommandID)
      	callback( (responseData.Status == 1 ? 'Successful' : 'Unsuccessful'));
     }
      	//client.unsubscribe("HTS/"+gatewayMacAdd+"/COMMAND/RESPONSE");
    });

    
    

}





exports.checkMqttOnlineStatus = function(req, res, parameter, callback){

  let client = mqtt_server.mqttClientStatus(req, res, parameter, callback);
  
}




/*db.collection('sent_command').save(data, function(err, res) {
        if( err || !res ) {
            console.log(err);
        }
        else {
            	//console.log("today data updated");
            	console.log('data',res);
            }

        });*/