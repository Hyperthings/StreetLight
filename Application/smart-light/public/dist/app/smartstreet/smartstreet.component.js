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
var moment = require("moment");
var ajax_service_1 = require("./../shared/services/ajax.service");
var variables_service_1 = require("./../shared/services/variables.service");
var energyGeneration = [];
var energyConsumption = [];
var lightStatus;
var dates = [];
var SmartStreetComponent = /** @class */ (function () {
    function SmartStreetComponent(ajaxService, variablesService) {
        this.ajaxService = ajaxService;
        this.variablesService = variablesService;
        this.overallSiteDevices = 0;
        this.overallOnlineDevices = 0;
        this.overallOfflineDevices = 0;
        this.dailyDatas = [];
        this.liveDatas = [];
        this.alarm_histories = [];
        this.variablesService.selectedMenu = "Smart Public Space";
    }
    SmartStreetComponent.prototype.ngOnInit = function () {
        var _this = this;
        NProgress.start();
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": {}, "collection": "live_data" }).subscribe(function (liveDatas) {
            _this.liveDatas = liveDatas;
            var energyGenerationDatas = [], energyConsumptionDatas = [], on = 0, off = 0;
            for (var _i = 0, liveDatas_1 = liveDatas; _i < liveDatas_1.length; _i++) {
                var liveData = liveDatas_1[_i];
                if (moment(liveData.ts).subtract(5, 'hours').subtract(30, 'minutes') < moment().subtract(10, 'hours').subtract(30, 'minutes')) {
                    console.log(liveData.ts);
                    _this.overallOfflineDevices += 1;
                }
                else {
                    _this.overallSiteDevices += 1;
                }
                /*liveData.ts = moment(liveData.ts).format("YYYY-MM-DD HH:mm:ss");
                this.liveDatas.push(liveData)*/
            }
            console.log('liveDatas', _this.liveDatas);
            for (var _a = 0, _b = _this.liveDatas; _a < _b.length; _a++) {
                var liveData = _b[_a];
                if (liveData.lightStatus == 0) {
                    off += 1;
                }
                else if (liveData.lightStatus == 1) {
                    on += 1;
                }
            }
            lightStatus = {
                "On": on,
                "Off": off
            };
            loadChart();
        });
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "isAssigned": false }, "collection": "alarm_history" }).subscribe(function (alarm_history) {
            console.log(alarm_history);
            for (var _i = 0, alarm_history_1 = alarm_history; _i < alarm_history_1.length; _i++) {
                var currentValue = alarm_history_1[_i];
                if (currentValue.occuredTime != "-") {
                    var dateTime = new Date(currentValue.occuredTime);
                    var currentData = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
                    currentValue.ts = currentData;
                }
                if (currentValue.clearedTime != "-") {
                    var dateTime = new Date(currentValue.clearedTime);
                    var currentData = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
                    currentValue.ts = currentData;
                }
                _this.alarm_histories.push(currentValue);
            }
            //this.alarm_histories = alarm_history;
            _this.alarm_histories = _this.alarm_histories.reverse();
            console.log('his.alarm_histories', _this.alarm_histories);
        });
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": {}, "collection": "day_wise_data" }).subscribe(function (dayWiseData) {
            var flags = [], l = dayWiseData.length, i;
            for (i = 0; i < l; i++) {
                if (flags[dayWiseData[i].dateString])
                    continue;
                flags[dayWiseData[i].dateString] = true;
                _this.dailyDatas.push(dayWiseData[i]);
            }
            dayWiseData = dayWiseData.sort(function (a, b) { return ('' + a.dateString).localeCompare(b.dateString); });
            var dataArray = [];
            function formatDate(subtractDate) {
                var datestring;
                datestring = moment().subtract(6 - subtractDate, 'days').format('YYYY' + 'MM' + 'DD');
                dataArray.push(datestring);
                return moment().subtract(6 - subtractDate, 'days').format('YYYY-MM-DD');
            }
            var lastSevenDaysArray = [];
            for (var i_1 = 0; i_1 < 7; i_1++) {
                var date = formatDate(i_1);
                lastSevenDaysArray.push(date);
                var weekDayName = moment(date).format('dddd');
                dates.push(weekDayName.substring(0, 2));
            }
            _this.dailyDatas = _this.dailyDatas.sort(function (a, b) { return ('' + a.dateString).localeCompare(b.dateString); });
            energyGeneration = ['Energy Generation (kWh)'];
            energyConsumption = ['Energy Consumption (kWh)'];
            //energySaved = ['Energy Saved'];
            var index = 0;
            for (var _i = 0, _a = _this.dailyDatas; _i < _a.length; _i++) {
                var dailyData = _a[_i];
                //energySaved.push(dailyData.EGeneration - dailyData.EConsumption)
                //let datestring = dailyData._id.year+'-'+dailyData._id.month+'-'+dailyData._id.day;
                energyGeneration.push(dailyData.EGeneration);
                energyConsumption.push(dailyData.EConsumption);
                index++;
            }
            console.log('energyConsumption', energyGeneration, energyConsumption, dates, _this.dailyDatas);
            loadEnergyChart();
        });
        function loadEnergyChart() {
            var chart1 = c3.generate({
                bindto: '#chart1',
                data: {
                    columns: [energyGeneration],
                    types: {
                        'Energy Generation (kWh)': 'bar'
                    },
                    colors: {
                        'Energy Generation (kWh)': '#008000'
                    },
                },
                zoom: {
                    enabled: true
                },
                axis: {
                    x: {
                        type: 'category',
                        categories: dates
                    }
                }
            });
            var char2 = c3.generate({
                bindto: '#chart2',
                data: {
                    columns: [energyConsumption],
                    types: {
                        'Energy Consumption (kWh)': 'bar'
                    },
                    colors: {
                        'Energy Consumption (kWh)': '#b36b00'
                    },
                },
                zoom: {
                    enabled: true
                },
                axis: {
                    x: {
                        type: 'category',
                        categories: dates
                    }
                }
            });
        }
        function loadChart() {
            var chart3 = c3.generate({
                bindto: '#chart3',
                data: {
                    json: lightStatus,
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
                }
            });
        }
        NProgress.done();
    };
    SmartStreetComponent.prototype.demoSubmit = function () {
    };
    SmartStreetComponent = __decorate([
        core_1.Component({
            selector: 'energy-index',
            templateUrl: './assets/src/app/smartstreet/smartstreet.component.html'
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService, variables_service_1.VariablesService])
    ], SmartStreetComponent);
    return SmartStreetComponent;
}());
exports.SmartStreetComponent = SmartStreetComponent;
//# sourceMappingURL=smartstreet.component.js.map