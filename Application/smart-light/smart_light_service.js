var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Smart_Light',
  description: 'The Smart Light web server.',
  script: require('path').join(__dirname,'server.js'),
  env: {
    name: "HOME",
    value: process.env["USERPROFILE"] // service is now able to access the user who created its' home directory
  }
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();

//svc.on('uninstall',function(){
  //console.log('Uninstall complete.');
  //console.log('The service exists: ',svc.exists);
//});

// Uninstall the service.
//svc.uninstall();