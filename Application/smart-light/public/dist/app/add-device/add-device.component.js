"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var XLSX = require("xlsx");
var ajax_service_1 = require("./../shared/services/ajax.service");
var variables_service_1 = require("./../shared/services/variables.service");
var AddDeviceComponent = /** @class */ (function () {
    function AddDeviceComponent(ajaxService, variablesService, _router, route, _location) {
        /* this.ajaxService.fetchSelectedObjects('getDistinctObjects',{"query": "site","collection":"site_details"}).subscribe(allSites => {
           this.allSites = allSites;
           this.allSites.sort();
         });*/
        this.ajaxService = ajaxService;
        this.variablesService = variablesService;
        this._router = _router;
        this.route = route;
        this._location = _location;
        this.passwordAlert = true;
        this.isThisGateway = true;
        this.devicesForAddToSite = [];
        this.popupResponseMessage = {};
        this.addOrUpdate = 'Add';
        this.hideButtons = true;
        this.showDeviceIdAvailableError = false;
        this.showGatewayMacAvailableError = false;
        this.showDeviceNameAvailableError = false;
        this.showInvalidAlert = false;
        this.hideDefaultInputs = true;
        this.showDeviceMACAvailableError = false;
    }
    AddDeviceComponent.prototype.ngOnInit = function () {
        var _this = this;
        NProgress.start();
        //this.siteName = this.route.snapshot.params.id;
        this.siteName = this.variablesService.selctedSiteName;
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": { 'siteName': this.siteName }, "collection": "site_details" }).subscribe(function (sitesDetails) {
            _this.sitesDetails = sitesDetails[0];
        });
        /* console.log('Add Gateway :',this.variablesService.addGateway
                     +'Edit Gateway :',this.variablesService.editGateway
                     +" Add Device : ",this.variablesService.addDevice
                     +" Edit Device : ",this.variablesService.editDevice
                     )*/
        /* this.variablesService.editGateway = false;
         this.variablesService.addGateway = false;
         this.variablesService.addDevice = false;
         this.variablesService.editDevice = true;*/
        this.gateway = new forms_1.FormGroup({
            gatewayName: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.minLength(2)]),
            siteName: new forms_1.FormControl(this.siteName, forms_1.Validators.required),
            //macAddress: new FormControl('', Validators.required),
            gatewayId: new forms_1.FormControl('', forms_1.Validators.required),
            latitude: new forms_1.FormControl('', forms_1.Validators.required),
            longitude: new forms_1.FormControl('', forms_1.Validators.required)
        });
        this.gatewayName = this.gateway.controls['gatewayName'].value;
        if (this.variablesService.addGateway == true) {
            this.gateway = new forms_1.FormGroup({
                gatewayName: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.minLength(2)]),
                siteName: new forms_1.FormControl(this.siteName, forms_1.Validators.required),
                //macAddress: new FormControl('', Validators.required),
                gatewayId: new forms_1.FormControl('', forms_1.Validators.required),
                latitude: new forms_1.FormControl('', forms_1.Validators.required),
                longitude: new forms_1.FormControl('', forms_1.Validators.required)
            });
            this.siteName = this.gateway.controls['siteName'].value;
        }
        else if (this.variablesService.addDevice == true) {
            this.isThisGateway = false;
            var selctedSiteGateway = JSON.parse(localStorage.getItem('selctedSiteGateway'));
            console.log('selctedSiteGateway', selctedSiteGateway);
            this.siteName = selctedSiteGateway.selectedSite;
            this.gatewayName = selctedSiteGateway.selectedGateway;
            this.gatewayId = selctedSiteGateway.selectedGatewayId;
            this.isThisGateway = false;
            this.addOrUpdate = 'Add';
            this.device = new forms_1.FormGroup({
                siteName: new forms_1.FormControl(this.siteName, forms_1.Validators.required),
                deviceName: new forms_1.FormControl('', forms_1.Validators.required),
                gatewayName: new forms_1.FormControl(this.gatewayName, forms_1.Validators.required),
                gatewayId: new forms_1.FormControl(this.gatewayId, forms_1.Validators.required),
                deviceId: new forms_1.FormControl('', forms_1.Validators.required),
                deviceMacAddress: new forms_1.FormControl('', forms_1.Validators.required),
                longitude: new forms_1.FormControl('', forms_1.Validators.required),
                latitude: new forms_1.FormControl('', forms_1.Validators.required),
            });
        }
        else if (this.variablesService.editGateway == true) {
            this.variablesService.selctedSiteGateway = false;
            this.selctedGatewayForEdit = JSON.parse(localStorage.getItem('selctedGateway'));
            console.log(this.selctedGatewayForEdit);
            this.isThisGateway = true;
            this.addOrUpdate = 'Update';
            this.siteName = this.selctedGatewayForEdit.siteName;
            this.gateway = new forms_1.FormGroup({
                siteName: new forms_1.FormControl(this.selctedGatewayForEdit.siteName, forms_1.Validators.required),
                gatewayName: new forms_1.FormControl(this.selctedGatewayForEdit.gatewayName, forms_1.Validators.required),
                gatewayId: new forms_1.FormControl(this.selctedGatewayForEdit.gatewayId, forms_1.Validators.required),
                //macAddress: new FormControl(this.selctedGatewayForEdit.macAddress, Validators.required),
                longitude: new forms_1.FormControl(this.selctedGatewayForEdit.longitude, forms_1.Validators.required),
                latitude: new forms_1.FormControl(this.selctedGatewayForEdit.latitude, forms_1.Validators.required)
            });
        }
        else if (this.variablesService.editDevice == true) {
            this.selctedDiviceForEdit = JSON.parse(localStorage.getItem('selctedDivices'));
            console.log(this.selctedDiviceForEdit);
            this.isThisGateway = false;
            this.addOrUpdate = 'Update';
            this.hideButtons = false;
            this.device = new forms_1.FormGroup({
                siteName: new forms_1.FormControl(this.selctedDiviceForEdit.siteName, forms_1.Validators.required),
                deviceName: new forms_1.FormControl(this.selctedDiviceForEdit.deviceName, forms_1.Validators.required),
                gatewayName: new forms_1.FormControl(this.selctedDiviceForEdit.gatewayName, forms_1.Validators.required),
                gatewayId: new forms_1.FormControl(this.selctedDiviceForEdit.gatewayId, forms_1.Validators.required),
                deviceId: new forms_1.FormControl(this.selctedDiviceForEdit.deviceId, forms_1.Validators.required),
                deviceMacAddress: new forms_1.FormControl(this.selctedDiviceForEdit.deviceMacAddress, forms_1.Validators.required),
                longitude: new forms_1.FormControl(this.selctedDiviceForEdit.longitude, forms_1.Validators.required),
                latitude: new forms_1.FormControl(this.selctedDiviceForEdit.latitude, forms_1.Validators.required)
            });
        }
        NProgress.done();
    };
    AddDeviceComponent.prototype.selectTyppe = function () {
        this.isThisGateway = !this.isThisGateway;
        this.isThisGateway == true ? 'Gateway' : 'Device';
        this.importedDevices = false;
        this.variablesService.isFromGateway = true;
        this.addOrUpdate = 'Add';
        this.siteName = this.gateway.controls['siteName'].value;
        this.gatewayName = this.gateway.controls['gatewayName'].value;
        this.gatewayId = this.gateway.controls['gatewayId'].value;
        this.device = new forms_1.FormGroup({
            siteName: new forms_1.FormControl(this.siteName, forms_1.Validators.required),
            deviceName: new forms_1.FormControl('', forms_1.Validators.required),
            gatewayName: new forms_1.FormControl(this.gatewayName, forms_1.Validators.required),
            gatewayId: new forms_1.FormControl(this.gatewayId, forms_1.Validators.required),
            deviceId: new forms_1.FormControl('', forms_1.Validators.required),
            deviceMacAddress: new forms_1.FormControl('', forms_1.Validators.required),
            longitude: new forms_1.FormControl('', forms_1.Validators.required),
            latitude: new forms_1.FormControl('', forms_1.Validators.required),
        });
        this.gateway = new forms_1.FormGroup({
            gatewayName: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.minLength(2)]),
            siteName: new forms_1.FormControl(this.siteName, forms_1.Validators.required),
            //macAddress: new FormControl('', Validators.required),
            gatewayId: new forms_1.FormControl('', forms_1.Validators.required),
            latitude: new forms_1.FormControl('', forms_1.Validators.required),
            longitude: new forms_1.FormControl('', forms_1.Validators.required)
        });
    };
    //Excel to JSON
    AddDeviceComponent.prototype.fileChangeEvent = function (evt) {
        var _this = this;
        this.importedDevices = [];
        var target = (evt.target);
        if (target.files.length !== 1)
            throw new Error('Cannot use multiple files');
        var reader = new FileReader();
        reader.onload = function (e) {
            /* read workbook */
            var bstr = e.target.result;
            var wb = XLSX.read(bstr, { type: 'binary' });
            /* grab first sheet */
            var wsname = wb.SheetNames[0];
            var ws = wb.Sheets[wsname];
            /* save data */
            _this.devicesForAddToSite = XLSX.utils.sheet_to_json(ws);
            console.log('devicesForAddToSite', Object(_this.devicesForAddToSite));
            console.log('devicesForAddToSite', typeof _this.devicesForAddToSite[0].deviceid);
            if (!_this.devicesForAddToSite[0].deviceId ||
                !_this.devicesForAddToSite[0].deviceName ||
                !_this.devicesForAddToSite[0].gatewayName ||
                !_this.devicesForAddToSite[0].gatewayId ||
                !_this.devicesForAddToSite[0].latitude ||
                !_this.devicesForAddToSite[0].longitude ||
                !_this.devicesForAddToSite[0].deviceMacAddress ||
                !_this.devicesForAddToSite[0].siteName) {
                _this.devicesForAddToSite = undefined;
                _this.popupStatusMessage = "Please select valid file";
                document.getElementById("openModalButton").click();
            }
            console.log('hhh', _this.devicesForAddToSite);
        };
        reader.readAsBinaryString(target.files[0]);
    };
    AddDeviceComponent.prototype.addToSite = function (device) {
        console.log(this.device.valid);
        //console.log('device',device);
        if (this.device.valid) {
            device.address = this.sitesDetails.address;
            device.solution = this.sitesDetails.solution;
            this.devicesForAddToSite.push(device);
            device = {};
            this.device = new forms_1.FormGroup({
                siteName: new forms_1.FormControl(this.siteName, forms_1.Validators.required),
                deviceName: new forms_1.FormControl('', forms_1.Validators.required),
                gatewayName: new forms_1.FormControl(this.gatewayName, forms_1.Validators.required),
                gatewayId: new forms_1.FormControl(this.gatewayId, forms_1.Validators.required),
                deviceId: new forms_1.FormControl('', forms_1.Validators.required),
                deviceMacAddress: new forms_1.FormControl('', forms_1.Validators.required),
                longitude: new forms_1.FormControl('', forms_1.Validators.required),
                latitude: new forms_1.FormControl('', forms_1.Validators.required),
            });
        }
        else {
            this.showInvalidAlert = true;
            var that_1 = this;
            setTimeout(function () {
                that_1.showInvalidAlert = false;
            }, 5000);
        }
    };
    AddDeviceComponent.prototype.onSubmit = function (value, event) {
        var _this = this;
        event.preventDefault();
        var that = this;
        var deviceRegistration = false;
        var data = value['_value'];
        var collectionName;
        if (this.variablesService.isFromGateway == false) {
            data = this.devicesForAddToSite[0];
            data['_id'] = this.selctedDiviceForEdit._id;
            data['address'] = this.selctedDiviceForEdit.address;
            data['solution'] = this.selctedDiviceForEdit.solution;
            collectionName = 'device_details';
            saveOrUpdateObject();
        }
        else if (this.variablesService.editGateway == true) {
            data._id = this.selctedGatewayForEdit._id;
            data.address = this.selctedGatewayForEdit.address;
            data.solution = this.selctedGatewayForEdit.solution;
            collectionName = 'gateway_details';
            saveOrUpdateObject();
            this.clearGateway();
        }
        else if (this.isThisGateway == true) {
            if (this.gateway.valid) {
                //data._id = this.gateway.controls['gatewayName'].value;
                data.address = this.sitesDetails.address;
                data.solution = this.sitesDetails.solution;
                collectionName = 'gateway_details';
                console.log(data);
                saveOrUpdateObject();
                this.clearGateway();
            }
            else {
                this.showInvalidAlert = true;
                setTimeout(function () {
                    that.showInvalidAlert = false;
                }, 5000);
            }
        }
        else {
            data = this.devicesForAddToSite;
            collectionName = 'device_details';
            deviceRegistration = true;
            saveOrUpdateObject();
        }
        function saveOrUpdateObject() {
            that.ajaxService.saveObject(data, collectionName).subscribe(function (device_details) {
                if (deviceRegistration != true) {
                    that.popupStatusMessage = collectionName == 'device_details' ? 'Device ' : 'Gateway ';
                    that.popupStatusMessage += device_details.message;
                    console.log("_details", device_details.message);
                    document.getElementById("openModalButton").click();
                }
            });
        }
        if (deviceRegistration == true) {
            this.popupStatusMessage = "Command Sent Successfully";
            document.getElementById("openModalButton").click();
            var i_1 = 0;
            var deviceArray = [];
            this.ajaxService.fetchSelectedObjects('getObjects', { "query": { 'gatewayName': data[0].gatewayName }, "collection": "device_details" }).subscribe(function (device_details) {
                //this.sitesDetails = device_details;
                for (var _i = 0, device_details_1 = device_details; _i < device_details_1.length; _i++) {
                    var device = device_details_1[_i];
                    _this.devicesForAddToSite.push(device);
                }
                console.log('All Devices : ', _this.devicesForAddToSite);
                var deviceData = "{\"CommandID\":" + Math.floor(100000000 + Math.random() * 900000000) + ",\"Command\":\"DeviceList\",\"gatewayMac\":\"" + data[0].gatewayName + "\"";
                for (var _a = 0, _b = _this.devicesForAddToSite; _a < _b.length; _a++) {
                    var device = _b[_a];
                    i_1++;
                    deviceData += ",\"Device" + i_1 + "\":{\"MacAddress\":\"" + device.deviceMacAddress + "\",\"SN\":\"" + device.deviceId + "\"}";
                }
                deviceData += "}";
                var regData = JSON.parse(deviceData);
                var regTopic = "HTS/" + data[0].gatewayName + "/COMMAND/DeviceList";
                $.blockUI(_this.cssObjectForblockUI());
                _this.ajaxService.registration('registration', { 'regData': regData, 'regTopic': regTopic }).subscribe(function (register) {
                    /*this.popupStatusMessage = "Command executed "+register;
                    document.getElementById("openModalButton").click();*/
                    $.unblockUI();
                    _this.popupResponseMessage = register;
                    document.getElementById("openModalResponseButton").click();
                });
                _this.devicesForAddToSite = [];
            });
        }
        //this._router.navigate(['/device']);
        this.device = new forms_1.FormGroup({
            siteName: new forms_1.FormControl(this.siteName, forms_1.Validators.required),
            deviceName: new forms_1.FormControl('', forms_1.Validators.required),
            gatewayName: new forms_1.FormControl(this.gatewayName, forms_1.Validators.required),
            gatewayId: new forms_1.FormControl(this.gatewayId, forms_1.Validators.required),
            deviceId: new forms_1.FormControl('', forms_1.Validators.required),
            deviceMacAddress: new forms_1.FormControl('', forms_1.Validators.required),
            longitude: new forms_1.FormControl('', forms_1.Validators.required),
            latitude: new forms_1.FormControl('', forms_1.Validators.required),
        });
        //this.isThisGateway = !this.isThisGateway
    };
    AddDeviceComponent.prototype.addImportedDevices = function () {
        var _this = this;
        var i = 0;
        var deviceArray = [];
        for (var _i = 0, _a = this.devicesForAddToSite; _i < _a.length; _i++) {
            var importedDevice = _a[_i];
            i += 1;
            var deviceName = 'device' + 1;
            deviceArray.push({ deviceName: {
                    "MacAddress": importedDevice.macaddress,
                    "SN": importedDevice.deviceid
                } });
        }
        console.log(deviceArray);
        var regData = { "CommandID": new Date().getTime(),
            "Command": "DeviceList",
            "devices": deviceArray,
            "gatewayMac": 'HTS-GT1'
        };
        var regTopic = "HTS/HTS-GT1/COMMAND/DeviceList";
        $.blockUI(this.cssObjectForblockUI());
        this.ajaxService.registration('mqttOnlineStatus', {}).subscribe(function (register) {
            _this.popupStatusMessage = "Command Sent " + register;
            document.getElementById("openModalButton").click();
            if (register == 'Successful') {
                _this.ajaxService.registration('registration', { 'regData': regData, 'regTopic': regTopic }).subscribe(function (register) {
                    /*this.popupStatusMessage = "Command Sent "+register;
                    document.getElementById("openModalButton").click();*/
                    $.unblockUI();
                    _this.popupResponseMessage = register;
                    console.log('popupResponseMessage', _this.popupResponseMessage);
                    document.getElementById("openModalResponseButton").click();
                });
            }
            else {
                $.unblockUI();
            }
        });
        /*this.ajaxService.saveObject(this.importedDevices,'device_details').subscribe(device_details => {
         
       });*/
    };
    AddDeviceComponent.prototype.checkdeviceIdAvailability = function (event) {
        var _this = this;
        this.showDeviceIdAvailableError = false;
        if (this.variablesService.editDevice == true && this.selctedDiviceForEdit.deviceId == event.target.value) {
            this.showDeviceIdAvailableError = false;
        }
        else {
            var existingDeviceIdCount = 0;
            if (this.devicesForAddToSite.length > 0) {
                for (var _i = 0, _a = this.devicesForAddToSite; _i < _a.length; _i++) {
                    var device = _a[_i];
                    if (device.deviceId == event.target.value) {
                        existingDeviceIdCount += 1;
                    }
                }
                if (existingDeviceIdCount > 0) {
                    this.showDeviceIdAvailableError = true;
                }
                else if (existingDeviceIdCount <= 0) {
                    this.showDeviceIdAvailableError = false;
                }
            }
            if (this.showDeviceIdAvailableError == false) {
                var deviceId = void 0;
                deviceId = event.target.value;
                this.ajaxService.fetchSelectedObjects('getObjects', { "query": { 'deviceId': deviceId }, "collection": "device_details" }).subscribe(function (device_details) {
                    console.log('device_details', device_details);
                    if (device_details.length > 0) {
                        _this.showDeviceIdAvailableError = true;
                    }
                    else if (device_details.length <= 0) {
                        _this.showDeviceIdAvailableError = false;
                    }
                });
            }
        }
    };
    AddDeviceComponent.prototype.checkGatwayMacAvailability = function (event) {
        var _this = this;
        var gatewayName;
        gatewayName = event.target.value;
        if (this.variablesService.editGateway == true && this.selctedGatewayForEdit.gatewayName == gatewayName) {
            this.showGatewayMacAvailableError = false;
        }
        else {
            this.ajaxService.fetchSelectedObjects('getObjects', { "query": { 'gatewayName': gatewayName }, "collection": "gateway_details" }).subscribe(function (gateway_details) {
                console.log('gateway_details', gateway_details);
                if (gateway_details.length > 0) {
                    _this.showGatewayMacAvailableError = true;
                }
                else if (gateway_details.length <= 0) {
                    _this.showGatewayMacAvailableError = false;
                }
                if (_this.showGatewayMacAvailableError == false) {
                    _this.ajaxService.fetchSelectedObjects('getObjects', { "query": { 'deviceMacAddress': gatewayName }, "collection": "device_details" }).subscribe(function (device_details) {
                        console.log('device_details', device_details);
                        if (device_details.length > 0) {
                            _this.showGatewayMacAvailableError = true;
                        }
                        else if (device_details.length <= 0) {
                            _this.showGatewayMacAvailableError = false;
                        }
                    });
                }
            });
        }
    };
    AddDeviceComponent.prototype.checkDeviceNameAvailability = function (event) {
        var _this = this;
        this.showDeviceNameAvailableError = false;
        if (this.variablesService.editDevice == true && this.selctedDiviceForEdit.deviceName == event.target.value) {
            this.showDeviceNameAvailableError = false;
        }
        else {
            var existingDeviceNameCount = 0;
            if (this.devicesForAddToSite.length > 0) {
                for (var _i = 0, _a = this.devicesForAddToSite; _i < _a.length; _i++) {
                    var device = _a[_i];
                    if (device.deviceName == event.target.value) {
                        existingDeviceNameCount += 1;
                    }
                }
                if (existingDeviceNameCount > 0) {
                    this.showDeviceNameAvailableError = true;
                }
                else if (existingDeviceNameCount <= 0) {
                    this.showDeviceNameAvailableError = false;
                }
            }
            if (this.showDeviceNameAvailableError == false) {
                var deviceName = void 0;
                deviceName = event.target.value;
                this.ajaxService.fetchSelectedObjects('getObjects', { "query": { 'deviceName': deviceName }, "collection": "device_details" }).subscribe(function (device_details) {
                    console.log('device_details', device_details);
                    if (device_details.length > 0) {
                        _this.showDeviceNameAvailableError = true;
                    }
                    else if (device_details.length <= 0) {
                        _this.showDeviceNameAvailableError = false;
                    }
                });
            }
        }
    };
    AddDeviceComponent.prototype.checkdeviceMacAvailability = function (event) {
        var _this = this;
        var deviceMac;
        deviceMac = event.target.value;
        this.showDeviceMACAvailableError = false;
        if (this.variablesService.editDevice == true && this.selctedDiviceForEdit.deviceMacAddress == deviceMac) {
            this.showDeviceMACAvailableError = false;
        }
        else {
            var existingDeviceMacCount = 0;
            if (this.devicesForAddToSite.length > 0) {
                for (var _i = 0, _a = this.devicesForAddToSite; _i < _a.length; _i++) {
                    var device = _a[_i];
                    if (device.deviceMacAddress == event.target.value) {
                        existingDeviceMacCount += 1;
                    }
                }
                if (existingDeviceMacCount > 0) {
                    this.showDeviceMACAvailableError = true;
                }
                else if (existingDeviceMacCount <= 0) {
                    this.showDeviceMACAvailableError = false;
                }
            }
            if (this.showDeviceMACAvailableError == false) {
                this.ajaxService.fetchSelectedObjects('getObjects', { "query": { 'deviceMacAddress': deviceMac }, "collection": "device_details" }).subscribe(function (device_details) {
                    console.log('device_details', device_details);
                    if (device_details.length > 0) {
                        _this.showDeviceMACAvailableError = true;
                    }
                    else if (device_details.length <= 0) {
                        _this.showDeviceMACAvailableError = false;
                    }
                    if (_this.showDeviceMACAvailableError == false) {
                        _this.ajaxService.fetchSelectedObjects('getObjects', { "query": { 'gatewayName': deviceMac }, "collection": "gateway_details" }).subscribe(function (device_details) {
                            console.log('device_details', device_details);
                            if (device_details.length > 0) {
                                _this.showDeviceMACAvailableError = true;
                            }
                            else if (device_details.length <= 0) {
                                _this.showDeviceMACAvailableError = false;
                            }
                        });
                    }
                });
            }
        }
    };
    AddDeviceComponent.prototype.cssObjectForblockUI = function () {
        return {
            css: {
                border: 'none',
                padding: '15px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: .5,
                color: '#fff'
            }
        };
    };
    AddDeviceComponent.prototype.clearGateway = function () {
        return this.gateway = new forms_1.FormGroup({
            gatewayName: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.minLength(2)]),
            siteName: new forms_1.FormControl(this.siteName, forms_1.Validators.required),
            //macAddress: new FormControl('', Validators.required),
            gatewayId: new forms_1.FormControl('', forms_1.Validators.required),
            latitude: new forms_1.FormControl('', forms_1.Validators.required),
            longitude: new forms_1.FormControl('', forms_1.Validators.required)
        });
    };
    AddDeviceComponent = __decorate([
        core_1.Component({
            selector: 'add-device',
            providers: [ajax_service_1.AjaxService],
            templateUrl: './assets/src/app/add-device/add-device.component.html',
            animations: [
                core_1.trigger('movePanel', [
                    core_1.transition('void => *', [
                        core_1.animate(600, core_1.keyframes([
                            core_1.style({ transform: 'translateX(25px)' }),
                            core_1.style({ transform: 'translateX(-25px)' }),
                            core_1.style({ transform: 'translateX(25px)' }),
                            core_1.style({ transform: 'translateX(-25px)' }),
                            core_1.style({ transform: 'translateX(25px)' }),
                            core_1.style({ transform: 'translateX(0)' }),
                        ]))
                    ]),
                    core_1.transition('* => void', [
                        core_1.animate(1000, core_1.keyframes([
                            core_1.style({ opacity: .8 }),
                            core_1.style({ opacity: .6 }),
                            core_1.style({ opacity: .4 }),
                            core_1.style({ opacity: .3 }),
                            core_1.style({ opacity: .2 }),
                            core_1.style({ opacity: .1 }),
                        ]))
                    ])
                ])
            ]
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService, variables_service_1.VariablesService, router_1.Router,
            router_1.ActivatedRoute, common_1.Location])
    ], AddDeviceComponent);
    return AddDeviceComponent;
}());
exports.AddDeviceComponent = AddDeviceComponent;
//# sourceMappingURL=add-device.component.js.map