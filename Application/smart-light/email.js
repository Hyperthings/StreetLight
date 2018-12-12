var email   = require("emailjs");
var EM = {};
module.exports = EM;

EM.server  = email.server.connect({
   user:    "notification@hyperthings.in", 
   password:"Things@017", 
   host:    "cloud.hyperthinksys.com", 
   ssl:     true
});

// send the message and get a callback with an error or details of the message that was sent

EM.sendAlarm = function(emailDetails)
    {

        EM.server.send({
           text:    "Alarm", 
           from:    "notification@hyperthings.in", 
           to:      emailDetails.to,
           //cc:      "arun@hyperthings.in",
           subject: emailDetails.subject,
           attachment   : EM.emailSubject(emailDetails)
        }, function(err, message) { 
            console.log("Email  successfully Send to ",emailDetails.to);
        });

    }




EM.emailSubject = function(data)
    {
console.log(data)
        
        var html = "<html><body>";
        html += "Hi,<br><br>";
        html += "New Alarm Generated from,</b><br><br>";
        html += "Site Name :"+data.info.siteName+"</a><br><br>";
		html += "Device ID :"+data.info.deviceName+"</a><br><br>";
		html += "TimeStamp : '"+data.ts+"'</a><br><br>";
		html += "Description :"+data.info.description+" </a><br><br>";
		html += "Severity :"+data.info.severity+"</a><br><br>";
        html += "Thanks,<br>";
        html += "Service Team<br><br>";
        html += "</body></html>";
        return  [{data:html, alternative:true}];
    }