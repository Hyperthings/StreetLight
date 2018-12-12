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
var common_1 = require("@angular/common");
var moment = require("moment");
var ajax_service_1 = require("./../shared/services/ajax.service");
var variables_service_1 = require("./../shared/services/variables.service");
var lightData;
var batteryVoltage;
var solarVoltage;
var batteryCharging;
var batteryCurrent;
var solarCurrent;
var batteryDischarging;
var lightStatus;
var deviceHealth;
var ledIndensity;
var chart1;
var chart2;
var chart5;
var chart6;
var SmartIrrigationComponent = /** @class */ (function () {
    function SmartIrrigationComponent(ajaxService, router, route, variablesService, location) {
        var _this = this;
        this.ajaxService = ajaxService;
        this.router = router;
        this.route = route;
        this.variablesService = variablesService;
        this.location = location;
        this.totalTodaydatas = {};
        this.allSitesData = {};
        this.deviceName = "home";
        this.widgetNamesValues = {
            thirdWidgetName: "",
            thirdWidgetValue: '',
            fourthWidgetName: "",
            fourthWidgetValue: '',
            fifthWidgetName: " ",
            fifthWidgetValue: 0,
            statusOrIndensityName: ""
        };
        this.energyGeneration = 0;
        this.energyConsumed = 0;
        this.ajaxService.fetchSelectedObjects('overallFormattedSites', { "query": {}, "collection": "today_datas" }).subscribe(function (totalTodaydatas) {
            _this.totalTodaydatas = totalTodaydatas;
        });
    }
    SmartIrrigationComponent.prototype.ngOnInit = function () {
        var _this = this;
        NProgress.start();
        var that = this;
        this.variablesService.isFromOverview = true;
        /*let siteName = this.route.snapshot.params.id;
        let deviceName = this.route.snapshot.params.id2;*/
        var siteName = this.variablesService.selctedSiteName;
        var deviceName = this.variablesService.selctedDeviceName;
        this.selectedSiteName = siteName;
        this.selectedDeviceName = this.variablesService.selctedDeviceDisplayName;
        console.log('Device Name : ', this.variablesService.selctedDeviceName);
        var collectionName;
        var siteQueryName;
        var deviceHealthData;
        if (siteName == undefined && deviceName == undefined) {
            collectionName = "all_sites_data";
        }
        else if (siteName != undefined && deviceName == undefined) {
            collectionName = "site_wise_data";
            siteQueryName = "siteName";
            this.ajaxService.fetchSelectedObjects('getCounts', { "query": {}, "collection": "device_details" }).subscribe(function (totalDeviceCount) {
                _this.widgetNamesValues.thirdWidgetName = ' No. of Street Lights Installed';
                _this.widgetNamesValues.thirdWidgetValue = totalDeviceCount;
            });
            this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "siteName": siteName }, "collection": "live_data" }).subscribe(function (siteLiveData) {
                calcuateDeviceHealthCount(siteLiveData);
            });
        }
        else if (siteName != undefined && deviceName != undefined) {
            collectionName = "today_data";
            siteQueryName = "siteName";
            console.log('deviceName', deviceName);
            this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "_id.deviceId": deviceName }, "collection": "live_data" }).subscribe(function (deviceLiveData) {
                calcuateDeviceHealthCount(deviceLiveData);
                _this.widgetNamesValues.thirdWidgetName = 'Light Status';
                _this.widgetNamesValues.thirdWidgetValue = deviceLiveData[0].lightStatus == '1' ? 'On' : 'Off';
                that.widgetNamesValues.fourthWidgetName = 'Solar Charging';
                that.widgetNamesValues.fourthWidgetValue = deviceLiveData[0].SolarCharging == '1' ? 'On' : 'Off';
            });
        }
        function calcuateDeviceHealthCount(deviceHealthDatas) {
            var deviceHealthError = 0, deviceHealthWarning = 0, lightStatusOn = 0, lightStatusOff = 0, SolarCharging = 0;
            for (var _i = 0, deviceHealthDatas_1 = deviceHealthDatas; _i < deviceHealthDatas_1.length; _i++) {
                var deviceHealthData_1 = deviceHealthDatas_1[_i];
                deviceHealthError += Number(deviceHealthData_1.Tamper) + Number(deviceHealthData_1.DeviceTamper) + Number(deviceHealthData_1.RTCHealth);
                Number(deviceHealthData_1.SolarHealth) + Number(deviceHealthData_1.BatteryHelath) +
                    Number(deviceHealthData_1.ledHealth) + Number(deviceHealthData_1.LDRHealth);
                //deviceHealthWarning += Number(deviceHealthData.ledHealth) + Number(deviceHealthData.LDRHealth);
                if (deviceHealthData_1.lightStatus == '1') {
                    lightStatusOn += 1;
                }
                else if (deviceHealthData_1.lightStatus == '0') {
                    lightStatusOff += 1;
                }
            }
            deviceHealth = {
                'Error': deviceHealthError,
                'Warning': deviceHealthWarning
            };
            lightStatus = {
                'On': lightStatusOn,
                'Off': lightStatusOff,
                'Unknown': 1
            };
            if (siteName != undefined && deviceName == undefined) {
                that.widgetNamesValues.fourthWidgetName = 'No. of Street Lights Online';
                that.widgetNamesValues.fourthWidgetValue = 0;
                for (var _a = 0, deviceHealthDatas_2 = deviceHealthDatas; _a < deviceHealthDatas_2.length; _a++) {
                    var liveData = deviceHealthDatas_2[_a];
                    if (moment(liveData._id.ts).subtract(5, 'hours').subtract(30, 'minutes') > moment().subtract(10, 'hours').subtract(30, 'minutes')) {
                        console.log(liveData._id.ts);
                        that.widgetNamesValues.fourthWidgetValue += 1;
                    }
                    //console.log('offline',this.overallOfflineDevices);
                }
                //that.widgetNamesValues.fourthWidgetValue = lightStatusOn;
            }
            else if (siteName != undefined && deviceName != undefined) {
            }
        } //'siteName' : siteName,"_id.deviceId" : deviceName
        function autoRefresh() {
            that.ajaxService.fetchSelectedObjects('getFormattedObjects', { "query": { 'siteName': siteName, "_id.deviceId": deviceName }, "collection": collectionName }).subscribe(function (today_datas) {
                lightData = today_datas;
                console.log('Today data', lightData);
                if (lightData['batteryVoltage'].length > 0 && lightData['ts'].length > 0) {
                    //that.energyConsumed = Math.trunc(lightData['totalEnergyConsumption']);
                    //that.energyGeneration = Math.trunc(lightData['totalEnergyGeneration']);
                    that.energyConsumed = lightData['totalEnergyConsumption'].toFixed(2);
                    that.energyGeneration = lightData['totalEnergyGeneration'].toFixed(2);
                    batteryVoltage = {
                        'TimeStamp': lightData['ts'],
                        'Battery Voltage(V)': lightData['batteryVoltage']
                    };
                    solarVoltage = {
                        'TimeStamp': lightData['ts'],
                        'Solar Voltage(V)': lightData['solarVoltage']
                    };
                    batteryCharging = {
                        'TimeStamp': lightData['ts'],
                        'Battery Charging': lightData['batteryCharging']
                    };
                    batteryCurrent = {
                        'TimeStamp': lightData['ts'],
                        'Battery Current(A)': lightData['batteryCurrent']
                    };
                    solarCurrent = {
                        'TimeStamp': lightData['ts'],
                        'Solar Current(A)': lightData['solarCurrent']
                    };
                    batteryDischarging = {
                        'TimeStamp': lightData['ts'],
                        'Battery Discharging': lightData['batteryDischarging']
                    };
                    ledIndensity = {
                        'Off': 100 - lightData['ledIndensity'],
                        "On": lightData['ledIndensity']
                    };
                    //console.log('energyConsumed', this.energyConsumed);
                    loadCharts();
                }
            });
        }
        autoRefresh();
        this.timeIntervalForRefresh = setInterval(function () { autoRefresh(); }, 60000);
        function loadCharts() {
            chart1 = c3.generate({
                bindto: '#chart1',
                data: {
                    x: 'TimeStamp',
                    xFormat: '%Y-%m-%d %H:%M:%S',
                    json: batteryVoltage,
                    type: 'spline',
                    colors: {
                        'Battery Voltage(V)': '#00cc00'
                    }
                },
                zoom: {
                    enabled: true
                },
                legend: {
                    show: true
                },
                axis: {
                    y: {
                        tick: {
                            count: 0
                        }
                    },
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%Y-%m-%d %H:%M:%S',
                            count: 3
                        },
                    }
                }
            });
            chart2 = c3.generate({
                bindto: '#chart2',
                data: {
                    x: 'TimeStamp',
                    xFormat: '%Y-%m-%d %H:%M:%S',
                    json: solarVoltage,
                    type: 'spline',
                    colors: {
                        'Solar Voltage(V)': '#00cc00'
                    }
                },
                zoom: {
                    enabled: true
                },
                legend: {
                    show: true
                },
                axis: {
                    y: {
                        tick: {
                            count: 0
                        }
                    },
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%Y-%m-%d %H:%M:%S',
                            count: 3
                        },
                    }
                }
            });
            var chart3 = c3.generate({
                bindto: '#chart3',
                data: {
                    x: 'TimeStamp',
                    xFormat: '%Y-%m-%d %H:%M:%S',
                    json: batteryCharging,
                    type: 'spline',
                    colors: {
                        'Battery Charging': '#4040bf'
                    }
                },
                zoom: {
                    enabled: true
                },
                legend: {
                    show: true
                },
                axis: {
                    y: {
                        tick: {
                            count: 0
                        }
                    },
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%Y-%m-%d %H:%M:%S',
                            count: 3
                        },
                    }
                }
            });
            chart5 = c3.generate({
                bindto: '#chart5',
                data: {
                    x: 'TimeStamp',
                    xFormat: '%Y-%m-%d %H:%M:%S',
                    json: batteryCurrent,
                    type: 'spline'
                },
                zoom: {
                    enabled: true
                },
                legend: {
                    show: true
                },
                axis: {
                    y: {
                        tick: {
                            count: 0
                        }
                    },
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%Y-%m-%d %H:%M:%S',
                            count: 3
                        },
                    }
                }
            });
            chart6 = c3.generate({
                bindto: '#chart6',
                data: {
                    x: 'TimeStamp',
                    xFormat: '%Y-%m-%d %H:%M:%S',
                    json: solarCurrent,
                    type: 'spline',
                    colors: {
                        'Solar Current(A)': '#8c1aff'
                    }
                },
                zoom: {
                    enabled: true
                },
                legend: {
                    show: true
                },
                axis: {
                    y: {
                        tick: {
                            count: 0
                        }
                    },
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%Y-%m-%d %H:%M:%S',
                            count: 3
                        },
                    }
                }
            });
            var chart7 = c3.generate({
                bindto: '#chart7',
                data: {
                    x: 'TimeStamp',
                    xFormat: '%Y-%m-%d %H:%M:%S',
                    json: batteryDischarging,
                    type: 'spline',
                    colors: {
                        'Battery Discharging': '#b36b00'
                    }
                },
                zoom: {
                    enabled: true
                },
                legend: {
                    show: true
                },
                axis: {
                    y: {
                        tick: {
                            count: 0
                        }
                    },
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%Y-%m-%d %H:%M:%S',
                            count: 3
                        },
                    }
                }
            });
            if (siteName != undefined && deviceName != undefined) {
                that.widgetNamesValues.statusOrIndensityName = "LED Intensity";
                var chart8 = c3.generate({
                    bindto: '#chart8',
                    data: {
                        json: ledIndensity,
                        type: 'pie',
                        colors: {
                            'On': 'green',
                            'Off': 'orange'
                        }
                    },
                    pie: {
                        label: {
                            format: function (value, ratio, id) {
                                return value;
                            }
                        }
                    },
                    legend: {
                        position: 'right'
                    }
                });
            }
            else if (siteName != undefined && deviceName == undefined) {
                that.widgetNamesValues.statusOrIndensityName = "Street Light Status";
                var chart8 = c3.generate({
                    bindto: '#chart8',
                    data: {
                        json: lightStatus,
                        type: 'pie'
                    },
                    pie: {
                        label: {
                            format: function (value, ratio, id) {
                                return value;
                            }
                        }
                    },
                    legend: {
                        position: 'right'
                    }
                });
            }
            var chart4 = c3.generate({
                bindto: '#chart4',
                data: {
                    json: deviceHealth,
                    type: 'pie'
                },
                color: {
                    pattern: ['#634688', '#7E9C38', '#26829B']
                },
                pie: {
                    label: {
                        format: function (value, ratio, id) {
                            return value;
                        }
                    }
                },
                legend: {
                    position: 'right'
                }
            });
        }
        /*var chart8 = c3.generate({
            bindto: '#chart8',
            data: {
                columns: [
                    ['On', 9],
                    ['Off', 45],
                    ['Unknown', 1]
                ],
                type : 'pie'
            }
        });*/
        NProgress.done();
    };
    SmartIrrigationComponent.prototype.maximizeChart1 = function () {
        this.enableMaximizeClass = true;
        this.hideChart1 = false;
        this.hideChart2 = true;
        this.hideChart3 = true;
        this.hideChart4 = true;
        this.setInnerHeight = 420;
        this.setHeaderHeight = '6%';
        chart1.resize({ height: 380, width: 1200 });
    };
    SmartIrrigationComponent.prototype.maximizeChart2 = function () {
        this.enableMaximizeClass = true;
        this.hideChart1 = true;
        this.hideChart2 = false;
        this.hideChart3 = true;
        this.hideChart4 = true;
        this.setInnerHeight = 420;
        this.setHeaderHeight = '6%';
        chart2.resize({ height: 380, width: 1200 });
    };
    SmartIrrigationComponent.prototype.maximizeChart3 = function () {
        this.enableMaximizeClass = true;
        this.hideChart1 = true;
        this.hideChart2 = true;
        this.hideChart3 = false;
        this.hideChart4 = true;
        this.setInnerHeight = 420;
        this.setHeaderHeight = '6%';
        chart5.resize({ height: 380, width: 1200 });
    };
    SmartIrrigationComponent.prototype.maximizeChart4 = function () {
        this.enableMaximizeClass = true;
        this.hideChart1 = true;
        this.hideChart2 = true;
        this.hideChart3 = true;
        this.hideChart4 = false;
        this.setInnerHeight = 420;
        this.setHeaderHeight = '6%';
        chart6.resize({ height: 380, width: 1200 });
    };
    SmartIrrigationComponent.prototype.mninimize = function () {
        this.enableMaximizeClass = false;
        this.hideChart1 = false;
        this.hideChart2 = false;
        this.hideChart3 = false;
        this.hideChart4 = false;
        this.setInnerHeight = 208;
        this.setHeaderHeight = '12%';
        chart1.resize({ height: 180, width: 300 });
        chart2.resize({ height: 180, width: 300 });
        chart5.resize({ height: 180, width: 300 });
        chart6.resize({ height: 180, width: 300 });
    };
    SmartIrrigationComponent.prototype.backToPreviousPage = function () {
        this.location.back();
    };
    SmartIrrigationComponent.prototype.ngOnDestroy = function () {
        clearInterval(this.timeIntervalForRefresh);
    };
    SmartIrrigationComponent = __decorate([
        core_1.Component({
            selector: 'energy-index',
            templateUrl: './assets/src/app/smartirrigation/smartirrigation.component.html'
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService, router_1.Router, router_1.ActivatedRoute,
            variables_service_1.VariablesService, common_1.Location])
    ], SmartIrrigationComponent);
    return SmartIrrigationComponent;
}());
exports.SmartIrrigationComponent = SmartIrrigationComponent;
//# sourceMappingURL=smartirrigation.component.js.map