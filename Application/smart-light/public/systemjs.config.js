/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function(global) {
  // map tells the System loader where to look for things
  var map = {
    'app':                        'assets/dist/app', // 'dist',
    '@angular':                   'assets/node_modules/@angular',
    'angular2-in-memory-web-api': 'assets/node_modules/angular2-in-memory-web-api',
    'rxjs':                       'assets/node_modules/rxjs',
    'ng2-cookies': 'node_modules/ng2-cookies',
    'moment': 'node_modules/moment',
    'mydaterangepicker': 'assets/node_modules/mydaterangepicker/bundles/mydaterangepicker.umd.js',
    'xlsx': 'assets/node_modules/xlsx/dist/xlsx.full.min.js', // <-- make sure xlsx.full.min.js is in same dir
    'fs': '',     // <--|
    'crypto': '', // <--| suppress native node modules
    'stream': ''  // <--|
  };
  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app':                        { main: 'main.js',  defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
    'ng2-cookies': { defaultExtension: 'js' },
    'moment': { main: 'moment.js', defaultExtension: 'js' }
  };

  var meta= {
    'xlsx': {
      exports: 'XLSX' // <-- tell SystemJS to expose the XLSX variable
    }
  };
  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'forms',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
    'router-deprecated',
    'upgrade',
  ];
  // Individual files (~300 requests):
  function packIndex(pkgName) {
    packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
  }
  // Bundled (~40 requests):
  function packUmd(pkgName) {
    packages['@angular/'+pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
  }
  // Most environments should use UMD; some (Karma) need the individual index files
  var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
  // Add package entries for angular packages
  ngPackageNames.forEach(setPackageConfig);
  var config = {
    map: map,
    packages: packages,
    meta: meta
  };
  System.config(config);
})(this);