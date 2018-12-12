var express = require('express');
var app = express();
var ObjectManager = require('./modules/objectmanager.js');
var mqtt_publisher = require('./modules/mqtt_publisher.js');
var mqtt_publisher = require('./modules/scheduler.js');
var objManager = new ObjectManager();

var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.get('/test', function (req, res) {

    console.log("I am sending data to client");

    res.send('Hello World!');


});

app.post('/saveObject/:objectType', function (req, res) {
    console.log(req.body);
    objManager.saveObject(req, res);

   /* res.json({
        success: true
    });*/
});


app.post('/deleteObject/:objectType/:id', function (req, res) {
    objManager.deleteObject(req.params.objectType, req.params.objectType.id);

    res.json({
        success: true
    });
});

app.post('/deleteObject', function (req, res) {
    objManager.deleteObject(req.body.data.collection, req.body.data.query, res);

    // res.json({
    //     success: true
    // });
});

app.get('/getAllObjects/:objectType', function (req, res) {
    
    objManager.getAllObjects(req.params.objectType, function (data) {
        //console.log(data);
        res.json(data);
    });

});

app.get('/getObjects/:objectType/:filter/:filterValue', function (req, res) {

    objManager.getObjects(req.params.objectType, req.params.filter, req.params.filterValue, function (data) {
        res.json(data);
    });

});

app.post('/getObjects', function (req, res) {

    //console.log("DATA",req.body.data)

    objManager.getObjects(req.body.data.query,req.body.data.collection, function (data) {
        //console.log("DATA:",data)
        res.json(data);
    });

});

app.post('/overallFormattedSites', function (req, res) {
    objManager.overallFormattedSites(req.body.data.query,req.body.data.collection,req.body.data.parameter, function (data) {
        res.json(data);
    });

});

app.post('/getDistinctObjects', function (req, res) {
    objManager.getDistinctObjects(req.body.data.query,req.body.data.collection,req.body.data.parameter, function (data) {
        res.json(data);
    });

});



app.post('/getCounts', function (req, res) {
    objManager.getCounts(req.body.data.query,req.body.data.collection,req.body.data.parameter, function (data) {
        res.json(data);
    });

});

app.post('/reportsData', function (req, res) {

    //console.log("DATA",req.body.data)

    objManager.reportsData(req.body.data.query,req.body.data.collection, function (data) {
        //console.log("DATA:",data)
        res.json(data);
    });

});

app.post('/getFormattedObjects', function (req, res) {

    objManager.getFormattedObjects(req.body.data.query,req.body.data.collection,req.body.data.parameter, function (data) {
        res.json(data);
    });
});

app.post('/registration', function (req, res) {
    //let responseMessage;
    objManager.registration(req, res, req.body.data.parameter, function (data) {
        console.log('Data', data);
            let responseMessage = {
                'CommandID': req.body.data.regData.CommandID,
                'Command': req.body.data.regData.Command,
                'Status': data
            }

         if (res.headersSent) {
                  res.end();
            } else {

                res.json(responseMessage);
            }
    });
     setTimeout(function(){
            if (res.headersSent) {
                res.end();
            } else {
                let responseMessage = {
                    'CommandID': req.body.data.regData.CommandID,
                    'Command': req.body.data.regData.Command,
                    'Status': "Unsuccessful"
                }
                 res.json(responseMessage);
            }
          }, 30000);
    /*mqtt_publisher.registerLightControl(req, res, function (data) {
        console.log('Res Data :',data);
        res.json(data);
    })*/
  //callback(mqtt_publisher.registerLightControl(req,parameter));

       // res.end();
});
app.post('/mqttOnlineStatus', function (req, res) {
    console.log('mqtt status');
    objManager.mqttOnlineStatus(req, res, req.body.data.parameter, function (data) {
        console.log(data);
        if (res.headersSent) {
                console.log('Headers sent!')
                res.end();
            } else {

                res.json(data);
            }
    });
});


app.use('/', express.static('public'));


var routes=['assets','home','siteoverview','scheduling',
'remote','analytics','lighting-remote','lighting-scheduling','alarm','liveData',
'reports','device','site','add-device','add-site', 'login', 'user', 'add-user', 
'energy-index','infrastructure-index', 'reports-filter']
routes.forEach(function (route) {
 app.use('/'+route, express.static('public'));
})

/*app.use('/bower_components', express.static('bower_components'));*/

app.listen(6017);