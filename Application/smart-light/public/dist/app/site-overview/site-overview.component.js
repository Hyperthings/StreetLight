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
var ajax_service_1 = require("./../shared/services/ajax.service");
var variables_service_1 = require("./../shared/services/variables.service");
var SiteOverviewComponent = /** @class */ (function () {
    function SiteOverviewComponent(ajaxService, variablesService, router) {
        var _this = this;
        this.ajaxService = ajaxService;
        this.variablesService = variablesService;
        this.router = router;
        this.sitesDetails = [];
        this.thisSitsGateways = [];
        this.popupResponseMessage = {};
        var privilegeQuery = { $or: [{ "siteName": "HTS" }, { "siteName": "Site-2" }] };
        NProgress.start();
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": {}, "collection": "site_details" }).subscribe(function (sitesDetails) {
            _this.sitesDetails = sitesDetails;
            _this.sitesDetails.sort();
            /* let flags = [], l = sitesDetails.length, i;
              for( i=0; i<l; i++) {
                  if( flags[sitesDetails[i].siteName]) continue;
                  flags[sitesDetails[i].siteName] = true;
                  this.sitesDetails.push(sitesDetails[i]);
                  this.sitesDetails.sort()
              }*/
        });
        //this.variablesService.selectedMenu ="Smart Public Space";
        NProgress.done();
    }
    SiteOverviewComponent.prototype.ngOnInit = function () {
    };
    SiteOverviewComponent.prototype.expandGateway = function (siteName, event) {
        var _this = this;
        this.thisSitsGateways = [];
        this.selectedSiteName = siteName;
        this.showExpandedGateways = !this.showExpandedGateways;
        this.showExpandedGateways ? event.target.className = 'caret-rotate-animation' : event.target.className = 'caret-rerotate-animation';
        if (this.showExpandedGateways == true) {
            this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "siteName": siteName }, "collection": "gateway_details" }).subscribe(function (site_details) {
                //this.thisSitsGateways = site_details;
                var flags = [], l = site_details.length, i;
                for (i = 0; i < l; i++) {
                    if (flags[site_details[i].gatewayName])
                        continue;
                    flags[site_details[i].gatewayName] = true;
                    _this.thisSitsGateways.push(site_details[i]);
                    _this.thisSitsGateways.sort();
                }
            });
        }
        else if (this.existingSiteName == siteName && !this.showExpandedGateways) {
            this.thisSitsGateways = [];
        }
        if (this.showExpandedGateways == false && this.prevSelectedRow != event) {
            this.prevSelectedRow.target.className = 'caret-rerotate-animation';
        }
        this.existingSiteName = siteName;
        this.prevSelectedRow = event;
        console.log('thisSitsGateways', this.thisSitsGateways);
        /* this.ajaxService.fetchSelectedObjects('getCounts',{"query": {},"collection":"live_data"}).subscribe(sitesDetails => {
           //this.sitesDetails = sitesDetails;
 
          console.log('sitesDetails',sitesDetails);
 
         });*/
    };
    SiteOverviewComponent.prototype.expandDevice = function (siteName, gateway, event) {
        var _this = this;
        this.thisSitsDevices = [];
        this.selectedSiteName = siteName;
        this.selectedGatewayName = gateway;
        this.showExpandedDevices = !this.showExpandedDevices;
        this.showExpandedDevices ? event.target.className = 'caret-rotate-animation' : event.target.className = 'caret-rerotate-animation';
        if (this.showExpandedDevices == true) {
            this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "siteName": siteName, "gatewayName": gateway }, "collection": "device_details" }).subscribe(function (live_data) {
                _this.thisSitsDevices = live_data;
            });
        }
        else if (this.existingGatewayName == gateway && !this.showExpandedDevices) {
            this.thisSitsDevices = [];
        }
        if (this.showExpandedDevices == false && this.prevSelectedRow != event) {
            this.prevSelectedRow.target.className = 'caret-rerotate-animation';
        }
        this.existingGatewayName = gateway;
        this.prevSelectedRow = event;
    };
    SiteOverviewComponent.prototype.addGateway = function (selectedSite) {
        this.variablesService.isFromGateway = true;
        this.variablesService.editGateway = false;
        this.variablesService.addGateway = true;
        this.variablesService.addDevice = false;
        this.variablesService.editDevice = false;
        localStorage.setItem('selctedGateway', '');
        this.variablesService.selctedSiteName = selectedSite;
        this.router.navigate(['/add-device']);
    };
    SiteOverviewComponent.prototype.editDevice = function (selctedDivices) {
        this.variablesService.isFromGateway = false;
        this.variablesService.editGateway = false;
        this.variablesService.addGateway = false;
        this.variablesService.addDevice = false;
        this.variablesService.editDevice = true;
        localStorage.setItem('selctedDivices', JSON.stringify(selctedDivices));
        console.log(localStorage.getItem('selctedDivices'));
        this.router.navigate(['/add-device']);
    };
    SiteOverviewComponent.prototype.editGateway = function (thisSitsGateway) {
        this.variablesService.selctedSiteGateway = false;
        this.variablesService.editGateway = true;
        this.variablesService.addGateway = false;
        this.variablesService.addDevice = false;
        this.variablesService.editDevice = false;
        localStorage.setItem('selctedGateway', JSON.stringify(thisSitsGateway));
        console.log(localStorage.getItem('selctedDivices'));
        this.router.navigate(['/add-device']);
    };
    SiteOverviewComponent.prototype.addDeviceForThisGateway = function (selectedSite, selectedGateway, selectedGatewayId) {
        this.variablesService.editGateway = false;
        this.variablesService.addGateway = false;
        this.variablesService.addDevice = true;
        this.variablesService.editDevice = false;
        this.variablesService.selctedSiteGateway = true;
        localStorage.setItem('selctedSiteGateway', JSON.stringify({ 'selectedSite': selectedSite, 'selectedGateway': selectedGateway, 'selectedGatewayId': selectedGatewayId }));
        console.log(localStorage.getItem('selctedSiteGateway'));
        this.router.navigate(['/add-device']);
    };
    SiteOverviewComponent.prototype.deleteSite = function (siteDetails) {
        var _this = this;
        console.log('siteDetails', siteDetails);
        this.ajaxService.fetchSelectedObjects('deleteObject', { "query": { 'siteName': siteDetails.siteName }, "collection": "site_details" }).subscribe(function (data) {
            console.log('data', data);
            _this.popupStatusMessage = "Site Deleted " + data.statusMessage;
            document.getElementById("openModalButton").click();
            _this.ajaxService.fetchSelectedObjects('getObjects', { "query": {}, "collection": "site_details" }).subscribe(function (sitesDetails) {
                _this.sitesDetails = sitesDetails;
                _this.sitesDetails.sort();
            });
        });
    };
    SiteOverviewComponent.prototype.deleteGateway = function (siteDetails, selectedGateway) {
        var _this = this;
        console.log('gateway Details', selectedGateway.gatewayName);
        this.ajaxService.fetchSelectedObjects('deleteObject', { "query": { 'siteName': siteDetails.siteName, 'gatewayName': selectedGateway.gatewayName }, "collection": "gateway_details" }).subscribe(function (data) {
            console.log('data', data);
            _this.popupStatusMessage = "Gateway Deleted " + data.statusMessage;
            document.getElementById("openModalButton").click();
            _this.ajaxService.fetchSelectedObjects('getObjects', { "query": {}, "collection": "site_details" }).subscribe(function (sitesDetails) {
                _this.sitesDetails = sitesDetails;
                _this.sitesDetails.sort();
            });
            _this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "siteName": _this.selectedSiteName }, "collection": "gateway_details" }).subscribe(function (site_details) {
                _this.thisSitsGateways = [];
                var flags = [], l = site_details.length, i;
                for (i = 0; i < l; i++) {
                    if (flags[site_details[i].gatewayName])
                        continue;
                    flags[site_details[i].gatewayName] = true;
                    _this.thisSitsGateways.push(site_details[i]);
                    _this.thisSitsGateways.sort();
                }
            });
        });
    };
    SiteOverviewComponent.prototype.deleteDevice = function (siteDetails, selectedGateway, selectedDevice) {
        var _this = this;
        console.log('device Details', selectedDevice);
        this.ajaxService.fetchSelectedObjects('deleteObject', { "query": { 'siteName': siteDetails.siteName, 'gatewayName': selectedGateway.gatewayName, 'deviceName': selectedDevice.deviceName }, "collection": "device_details" }).subscribe(function (data) {
            console.log('data', data);
            if (data.statusMessage == "Successfully") {
                var regData = {
                    "CommandID": Math.floor(100000000 + Math.random() * 900000000),
                    "Command": "delete",
                    "MacAddress": selectedDevice.deviceMacAddress,
                    "SN": selectedDevice.deviceId,
                    //"Status":selectedDevice.lightStatus,
                    "gatewayMac": selectedDevice.gatewayName
                };
                console.log(regData);
                var regTopic = "HTS/" + selectedDevice.gatewayName + "/COMMAND/delete";
                /*  this.ajaxService.registration('mqttOnlineStatus', {}).subscribe(register =>{
                    this.popupStatusMessage = "Command Sent "+register;
                    document.getElementById("openModalButton").click();
                    console.log(this.popupStatusMessage);
                    if(register == 'Successful'){*/
                _this.ajaxService.registration('registration', { 'regData': regData, 'regTopic': regTopic }).subscribe(function (register) {
                    _this.popupResponseMessage = register;
                    console.log(_this.popupResponseMessage);
                    document.getElementById("openModalResponseButton").click();
                });
                /*}
              })*/
            }
            _this.popupStatusMessage = "Device Deleted " + data.statusMessage;
            document.getElementById("openModalButton").click();
            _this.ajaxService.fetchSelectedObjects('getObjects', { "query": {}, "collection": "site_details" }).subscribe(function (sitesDetails) {
                _this.sitesDetails = sitesDetails;
                _this.sitesDetails.sort();
            });
            _this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "siteName": _this.selectedSiteName }, "collection": "gateway_details" }).subscribe(function (gateway_details) {
                _this.thisSitsGateways = gateway_details;
                _this.thisSitsGateways.sort();
                /*this.thisSitsGateways = [];
                let flags = [], l = site_details.length, i;
                for( i=0; i<l; i++) {
                    if( flags[site_details[i].gatewayName]) continue;
                    flags[site_details[i].gatewayName] = true;
                    this.thisSitsGateways.push(site_details[i]);
                    this.thisSitsGateways.sort();
                }*/
            });
            _this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "siteName": _this.selectedSiteName, "gatewayName": _this.selectedGatewayName }, "collection": "device_details" }).subscribe(function (live_data) {
                _this.thisSitsDevices = [];
                _this.thisSitsDevices = live_data;
                _this.thisSitsDevices.sort();
            });
        });
    };
    SiteOverviewComponent = __decorate([
        core_1.Component({
            selector: 'site',
            templateUrl: './assets/src/app/site-overview/site-overview.component.html'
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService, variables_service_1.VariablesService, router_1.Router])
    ], SiteOverviewComponent);
    return SiteOverviewComponent;
}());
exports.SiteOverviewComponent = SiteOverviewComponent;
//# sourceMappingURL=site-overview.component.js.map