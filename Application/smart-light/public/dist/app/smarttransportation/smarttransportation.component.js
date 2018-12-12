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
var moment = require("moment");
var ajax_service_1 = require("./../shared/services/ajax.service");
var variables_service_1 = require("./../shared/services/variables.service");
var SmartTransportationComponent = /** @class */ (function () {
    function SmartTransportationComponent(ajaxService, variablesService, route) {
        /*let siteName = this.route.snapshot.params.id;*/
        this.ajaxService = ajaxService;
        this.variablesService = variablesService;
        this.route = route;
        this.f_sl = 1;
        this.f_nm = 1;
        this.minutes = new Array(24);
        this.seconds = new Array(60);
        this.firstAlarmTime = 0;
        this.secondAlarmTime = 0;
        this.thirdAlarmTime = 0;
        this.firstAlarmMinute = 0;
        this.secondAlarmMinute = 0;
        this.thirdAlarmMinute = 0;
        this.firstAlarmIndensity = 0;
        this.secondAlarmIndensity = 0;
        this.thirdAlarmIndensity = 0;
        this.pirTimeout = 0;
        this.popupResponseMessage = {};
    }
    SmartTransportationComponent.prototype.ngOnInit = function () {
        var _this = this;
        var that = this;
        var siteName = this.variablesService.selctedSiteName;
        this.selectedSiteName = siteName;
        console.log(siteName);
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "siteName": siteName }, "collection": "gateway_details" }).subscribe(function (gateway_details) {
            console.log(gateway_details.length);
            if (gateway_details.length <= 0) {
                console.log('gateway_details', gateway_details);
                _this.thisSiteGateway = true;
                _this.popupStatusMessage = "No gateways for this Site";
                document.getElementById("openModalButton").click();
            }
        });
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "siteName": siteName }, "collection": "light_controls" }).subscribe(function (light_controls) {
            _this.lightControlData = light_controls[0];
            var firstAlarmTimeArray = _this.lightControlData.firstAlarmTime.split(':');
            _this.firstAlarmTime = Number(firstAlarmTimeArray[0]);
            _this.firstAlarmMinute = Number(firstAlarmTimeArray[1]);
            var secondAlarmArray = _this.lightControlData.secondAlarmTime.split(':');
            _this.secondAlarmTime = Number(secondAlarmArray[0]);
            _this.secondAlarmMinute = Number(secondAlarmArray[1]);
            var thirdAlarmTimeArray = _this.lightControlData.thirdAlarmTime.split(':');
            _this.thirdAlarmTime = Number(thirdAlarmTimeArray[0]);
            _this.thirdAlarmMinute = Number(thirdAlarmTimeArray[1]);
            _this.firstAlarmIndensity = _this.lightControlData.firstAlarmIndensity;
            _this.secondAlarmIndensity = _this.lightControlData.secondAlarmIndensity;
            _this.thirdAlarmIndensity = _this.lightControlData.thirdAlarmIndensity;
            _this.pirTimeout = _this.lightControlData.pirTimeout;
        });
        function autoRefresh() {
            that.ajaxService.fetchSelectedObjects('getObjects', { "query": { "siteName": siteName }, "collection": "live_data" }).subscribe(function (light_control_devices) {
                that.lightControlDevices = light_control_devices;
                var i = 0;
                for (var _i = 0, _a = that.lightControlDevices; _i < _a.length; _i++) {
                    var lightControlDevice = _a[_i];
                    //console.log(moment(lightControlDevice._id.ts)+' date '+moment())
                    if (moment(lightControlDevice._id.ts).subtract(5, 'hours').subtract(30, 'minutes') < moment().subtract(10, 'hours').subtract(30, 'minutes')) {
                        that.lightControlDevices[i].registerStatus = false;
                    }
                    else {
                        that.lightControlDevices[i].registerStatus = true;
                    }
                    i++;
                }
                console.log('lightControlDevices', that.lightControlDevices);
            });
        }
        autoRefresh();
        this.timeIntervalForRefresh = setInterval(function () {
            autoRefresh();
        }, 60000);
        this.variablesService.selectedMenu = "Smart Transportation";
    };
    SmartTransportationComponent.prototype.timeScheduler = function () {
        setTimeout(function () { alert("Hello"); }, 3000);
    };
    SmartTransportationComponent.prototype.scheduleTime = function (data) {
        console.log(data);
        setTimeout(function () { alert("Data Sent"); }, data * 1000);
        //this.timeScheduler();
    };
    SmartTransportationComponent.prototype.getSelectedColumn = function (selectedColumn) {
        this.selectedColumn = selectedColumn;
    };
    /* filterLightControl(event:any) {
    var filter = event.target.value.toUpperCase();
    var rows = document.querySelector("#lightControlTable tbody").rows;
    
    for (var i = 0; i < rows.length; i++) {
        var firstCol = rows[i].cells[0].textContent.toUpperCase();
        var secondCol = rows[i].cells[1].textContent.toUpperCase();
        var thirdCol = rows[i].cells[2].textContent.toUpperCase();
        if (firstCol.indexOf(filter) > -1 || secondCol.indexOf(filter) > -1 || thirdCol.indexOf(filter) > -1) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}*/
    /*sortTable(f:any,n:number,sortingOrder:string){
        var rows = $('#lightControlTable tbody  tr').get();

            rows.sort(function(a:any, b:any) {

              var A = getVal(a);
              var B = getVal(b);

              if (sortingOrder == 'descending') {
               if(A < B) {
                return -1*f;
              }
              }
             
             if (sortingOrder == 'ascending') {
              if(A > B) {
                return 1*f;
              }
            }
              return 0;
            });

            function getVal(elm:any){
              var v = $(elm).children('td').eq(n).text().toUpperCase();
              if($.isNumeric(v)){
                v = parseInt(v,10);
              }
              return v;
            }

            $.each(rows, function(index:any, row:any) {
              $('#lightControlTable').children('tbody').append(row);
            });
     }
     sorting(sortingOrder:string){
        this.f_sl *= -1;
              var n = this.selectedColumn //$(this).prevAll().length;
              this.sortTable(this.f_sl,n,sortingOrder);
     }*/
    SmartTransportationComponent.prototype.sorting = function (sortingOrder, property) {
        this.isAscending = !this.isAscending;
        var direction = (sortingOrder == 'ascending') ? 1 : -1;
        this.lightControlDevices.sort(function (a, b) {
            if (sortingOrder == 'descending') {
                if (a[property] < b[property]) {
                    return -1 * direction;
                }
                else {
                    return 0;
                }
            }
            if (sortingOrder == 'ascending') {
                if (a[property] > b[property]) {
                    return 1 * direction;
                }
                else {
                    return 0;
                }
            }
        });
    };
    //search..
    SmartTransportationComponent.prototype.getSiteName = function (event) {
        var filter = event.target.value.toUpperCase();
        var rows = document.querySelector("#lightControlTable tbody").rows;
        for (var i = 0; i < rows.length; i++) {
            var firstCol = rows[i].cells[0].textContent.toUpperCase();
            var secondCol = rows[i].cells[1].textContent.toUpperCase();
            var thirdCol = rows[i].cells[2].textContent.toUpperCase();
            if (this.selectedColumn == 0) {
                if (firstCol.indexOf(filter) > -1) {
                    rows[i].style.display = "";
                }
                else {
                    rows[i].style.display = "none";
                }
            }
            if (this.selectedColumn == 1) {
                if (secondCol.indexOf(filter) > -1) {
                    rows[i].style.display = "";
                }
                else {
                    rows[i].style.display = "none";
                }
            }
            if (this.selectedColumn == 2) {
                if (thirdCol.indexOf(filter) > -1) {
                    rows[i].style.display = "";
                }
                else {
                    rows[i].style.display = "none";
                }
            }
            /*
                    if (this.selectedColumn == 0) {
                     if (firstCol.indexOf(filter) > -1 || secondCol.indexOf(filter) > -1 || thirdCol.indexOf(filter) > -1) {
                        rows[i].style.display = "";
                    } else {
                        rows[i].style.display = "none";
                    }
                    }*/
        }
    };
    /* updateConfiguredLight(){
       let firstAlarmTimeString = this.firstAlarmTime+':'+this.firstAlarmMinute
       let secondAlarmTimeString = this.secondAlarmTime+':'+this.secondAlarmMinute
       let thirdAlarmTimeString = this.thirdAlarmTime+':'+this.thirdAlarmMinute
       console.log(thirdAlarmTimeString)
      let updatedData = {
        "_id" : this.lightControlData._id,
        "siteName" : this.lightControlData.siteName,
        "firstAlarmTime" : firstAlarmTimeString,
        "secondAlarmTime" : secondAlarmTimeString,
        "thirdAlarmTime" : thirdAlarmTimeString,
        "firstAlarmIndensity" : this.firstAlarmIndensity,
        "secondAlarmIndensity" : this.secondAlarmIndensity,
        "thirdAlarmIndensity" : this.thirdAlarmIndensity,
        "pirTimeout" : this.pirTimeout
      }
      this.ajaxService.saveObject(updatedData,'light_controls').subscribe(light_controls => {
        console.log("light_controls",light_controls)
        this.popupStatusMessage = "Configuration Command Sent Successfully"
        document.getElementById("openModalButton").click();
      });
     }*/
    SmartTransportationComponent.prototype.registerCommand = function (lightControlDevice, event, i) {
        var _this = this;
        $.blockUI(this.cssObjectForblockUI());
        console.log(lightControlDevice);
        if (event.target.disabled != true) {
            document.getElementById("switch-label-id" + i).style.backgroundColor = "orange";
            document.getElementById("switch-label-id" + i).classList.add('disabled');
            event.target.disabled = true;
            /* setTimeout(function(){
             document.getElementById("switch-label-id"+i).style.backgroundColor = "green";
            }, 5000);*/
            var regData_1 = {
                "CommandID": Math.floor(100000000 + Math.random() * 900000000),
                "Command": "Register",
                "MacAddress": lightControlDevice.deviceMacAddress,
                "SN": lightControlDevice._id.deviceId,
                //"Status":lightControlDevice.lightStatus,
                "gatewayMac": lightControlDevice.gatewayName
            };
            console.log(regData_1);
            var regTopic_1 = "HTS/" + lightControlDevice.gatewayName + "/COMMAND/Register";
            this.ajaxService.registration('mqttOnlineStatus', {}).subscribe(function (register) {
                _this.popupStatusMessage = "Command Sent " + register;
                document.getElementById("openModalButton").click();
                console.log(_this.popupStatusMessage);
                if (register == 'Successful') {
                    _this.ajaxService.registration('registration', { 'regData': regData_1, 'regTopic': regTopic_1 }).subscribe(function (register) {
                        _this.popupResponseMessage = register;
                        console.log(_this.popupResponseMessage);
                        document.getElementById("openModalResponseButton").click();
                        $.unblockUI();
                        _this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "siteName": _this.selectedSiteName }, "collection": "live_data" }).subscribe(function (light_control_devices) {
                            _this.lightControlDevices = light_control_devices;
                            var i = 0;
                            for (var _i = 0, _a = _this.lightControlDevices; _i < _a.length; _i++) {
                                var lightControlDevice_1 = _a[_i];
                                if (moment(lightControlDevice_1._id.ts).subtract(5, 'hours').subtract(30, 'minutes') < moment().subtract(10, 'hours').subtract(30, 'minutes')) {
                                    _this.lightControlDevices[i].registerStatus = false;
                                }
                                else {
                                    _this.lightControlDevices[i].registerStatus = true;
                                }
                                i++;
                            }
                            console.log('lightControlDevices', _this.lightControlDevices);
                        });
                        if (register == 'Successful') {
                            document.getElementById("switch-label-id" + i).style.backgroundColor = "green";
                        }
                    });
                }
                else {
                    $.unblockUI();
                }
            });
        }
    };
    SmartTransportationComponent.prototype.changeStatusCommand = function (lightControlDevice, event, i) {
        var _this = this;
        $.blockUI(this.cssObjectForblockUI());
        var selector = '.switch-input' + i + ':checked';
        var checkedValue = $(selector).val();
        var status;
        checkedValue == 'on' ? status = 1 : status = 0;
        console.log('checkedValue', checkedValue);
        var regData = {
            "CommandID": Math.floor(100000000 + Math.random() * 900000000),
            "Command": "LEDCONTROL",
            "MacAddress": lightControlDevice.deviceMacAddress,
            "SN": lightControlDevice._id.deviceId,
            "Status": status,
            "gatewayMac": lightControlDevice.gatewayName
        };
        console.log(lightControlDevice.gatewayName);
        var regTopic = "HTS/" + lightControlDevice.gatewayName + "/COMMAND/LEDCONTROL";
        if (lightControlDevice.deviceMacAddress != undefined || lightControlDevice.gatewayName != undefined) {
            this.ajaxService.registration('mqttOnlineStatus', {}).subscribe(function (register) {
                _this.popupStatusMessage = "Command Sent " + register;
                document.getElementById("openModalButton").click();
                console.log(_this.popupStatusMessage);
                if (register == 'Successful') {
                    _this.ajaxService.registration('registration', { 'regData': regData, 'regTopic': regTopic }).subscribe(function (register) {
                        _this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "siteName": _this.selectedSiteName }, "collection": "live_data" }).subscribe(function (light_control_devices) {
                            _this.lightControlDevices = light_control_devices;
                            var i = 0;
                            for (var _i = 0, _a = _this.lightControlDevices; _i < _a.length; _i++) {
                                var lightControlDevice_2 = _a[_i];
                                if (moment(lightControlDevice_2._id.ts).subtract(5, 'hours').subtract(30, 'minutes') < moment().subtract(10, 'hours').subtract(30, 'minutes')) {
                                    _this.lightControlDevices[i].registerStatus = false;
                                }
                                else {
                                    _this.lightControlDevices[i].registerStatus = true;
                                }
                                i++;
                            }
                            console.log('lightControlDevices', _this.lightControlDevices);
                        });
                        $.unblockUI();
                        _this.popupResponseMessage = register;
                        console.log(_this.popupResponseMessage);
                        document.getElementById("openModalResponseButton").click();
                    });
                }
                else {
                    $.unblockUI();
                }
            });
        }
        else {
            this.popupStatusMessage = "Check Gateway or Device MAC Address";
            document.getElementById("openModalButton").click();
        }
    };
    SmartTransportationComponent.prototype.updateConfiguredLight = function () {
        var _this = this;
        if (this.pirTimeout > 100 || this.pirTimeout < 30) {
            this.pirTimeOutLError = true;
            var that_1 = this;
            setTimeout(function () { that_1.pirTimeOutLError = true; }, 3000);
        }
        else {
            $.blockUI(this.cssObjectForblockUI());
            var firstAlarmTimeString_1 = (this.firstAlarmTime < 10 ? 0 + '' + this.firstAlarmTime : this.firstAlarmTime) + '' + (this.firstAlarmMinute < 10 ? 0 + '' + this.firstAlarmMinute : this.firstAlarmMinute);
            var secondAlarmTimeString_1 = (this.secondAlarmTime < 10 ? 0 + '' + this.secondAlarmTime : this.secondAlarmTime) + '' + (this.secondAlarmMinute < 10 ? 0 + '' + this.secondAlarmMinute : this.secondAlarmMinute);
            var thirdAlarmTimeString_1 = (this.thirdAlarmTime < 10 ? 0 + '' + this.thirdAlarmTime : this.thirdAlarmTime) + '' + (this.thirdAlarmMinute < 10 ? 0 + '' + this.thirdAlarmMinute : this.thirdAlarmMinute);
            /*let updatedData = {
              "_id" : this.lightControlData._id,
              "siteName" : this.lightControlData.siteName,
              "firstAlarmTime" : firstAlarmTimeString,
              "secondAlarmTime" : secondAlarmTimeString,
              "thirdAlarmTime" : thirdAlarmTimeString,
              "firstAlarmIndensity" : this.firstAlarmIndensity,
              "secondAlarmIndensity" : this.secondAlarmIndensity,
              "thirdAlarmIndensity" : this.thirdAlarmIndensity,
              "pirTimeout" : this.pirTimeout
            }*/
            //this.popupStatusMessage = "Command Sent Successfully ";
            //document.getElementById("openModalButton").click();
            this.ajaxService.registration('mqttOnlineStatus', {}).subscribe(function (register) {
                _this.popupStatusMessage = "Command Sent " + register;
                document.getElementById("openModalButton").click();
                console.log(_this.popupStatusMessage);
                if (register == 'Successful') {
                    var thisSiteGateways_1;
                    _this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "siteName": _this.selectedSiteName }, "collection": "gateway_details" }).subscribe(function (gateway_details) {
                        thisSiteGateways_1 = gateway_details;
                        console.log('gateway_details', gateway_details);
                        for (var _i = 0, thisSiteGateways_2 = thisSiteGateways_1; _i < thisSiteGateways_2.length; _i++) {
                            var thisSiteGateway = thisSiteGateways_2[_i];
                            var regData = {
                                "CommandID": Math.floor(100000000 + Math.random() * 900000000),
                                "Command": "DeviceConfiguration",
                                "SetDimTimeOne": firstAlarmTimeString_1,
                                "SetDimPercentageOne": _this.firstAlarmIndensity,
                                "SetDimTimeTwo ": secondAlarmTimeString_1,
                                "SetDimPercentageTwo": _this.secondAlarmIndensity,
                                "SetDimTimeThree ": thirdAlarmTimeString_1,
                                "SetDimPercentageThree": _this.thirdAlarmIndensity,
                                "SetPIRTimeOut": _this.pirTimeout,
                                //"MacAddress":lightConfigurationData._id.deviceMacAddress,
                                //"DeviceId":lightConfigurationData._id.deviceId,
                                //"Status":lightConfigurationData.lightStatus,
                                "gatewayMac": thisSiteGateway.gatewayName
                            };
                            console.log('updatedData', regData);
                            var regTopic = "HTS/" + thisSiteGateway.gatewayName + "/COMMAND/CONFIG";
                            _this.ajaxService.registration('registration', { 'regData': regData, 'regTopic': regTopic }).subscribe(function (register) {
                                $.unblockUI();
                                _this.popupResponseMessage = register;
                                console.log(_this.popupResponseMessage);
                                document.getElementById("openModalResponseButton").click();
                            });
                        }
                    });
                }
                else {
                    $.unblockUI();
                }
            });
        }
    };
    SmartTransportationComponent.prototype.preventInput = function (event) {
        /*let value=this.pirTimeout;
        if (value >= 101){
          event.preventDefault()
          this.pirTimeout = 100;
        }else if (value <= 29){
          event.preventDefault()
          this.pirTimeout = 30;
        }*/
        if (this.pirTimeout > 100 || this.pirTimeout < 30) {
            this.pirTimeOutLError = true;
        }
        else {
            this.pirTimeOutLError = false;
        }
    };
    SmartTransportationComponent.prototype.cssObjectForblockUI = function () {
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
    SmartTransportationComponent.prototype.ngOnDestroy = function () {
        clearInterval(this.timeIntervalForRefresh);
    };
    SmartTransportationComponent = __decorate([
        core_1.Component({
            selector: 'energy-index',
            templateUrl: './assets/src/app/smarttransportation/smarttransportation.component.html'
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService, variables_service_1.VariablesService, router_1.ActivatedRoute])
    ], SmartTransportationComponent);
    return SmartTransportationComponent;
}());
exports.SmartTransportationComponent = SmartTransportationComponent;
//# sourceMappingURL=smarttransportation.component.js.map