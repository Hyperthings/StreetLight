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
var chart1;
var chart2;
var chart3;
//var genarationData: Object;
var energyGeneration = [];
var energyConsumption = [];
var energySaved = [];
var months = [];
var SmartMeteringComponent = /** @class */ (function () {
    //selectedSite: string;
    //selectedRow:any;
    function SmartMeteringComponent(ajaxService, variablesService) {
        this.ajaxService = ajaxService;
        this.variablesService = variablesService;
        this.liveDatas = [];
        this.thisSitsDevices = [];
        this.showExpandedDevices = false;
        this.f_sl = 1;
        this.f_nm = 1;
        this.privilegeDetails = JSON.parse(localStorage.getItem('privilegeDetails'));
        console.log(this.privilegeDetails);
    }
    SmartMeteringComponent.prototype.ngOnInit = function () {
        NProgress.start();
        var that = this;
        function autoRefresh() {
            that.ajaxService.fetchSelectedObjects('getObjects', { "query": {}, "collection": "live_data" }).subscribe(function (live_data) {
                //for get distinct objects
                that.liveDatas = [];
                //live_data = live_data.reverse();
                var flags = [], l = live_data.length, i;
                for (i = 0; i < l; i++) {
                    if (flags[live_data[i].siteName])
                        continue;
                    flags[live_data[i].siteName] = true;
                    that.liveDatas.push(live_data[i]);
                }
                console.log(that.liveDatas);
            });
        }
        autoRefresh();
        this.timeIntervalForRefresh = setInterval(function () {
            autoRefresh();
            /*that.expandDevice(that.selectedSite, that.selectedRow);
            this.showExpandedDevices = false*/
            /*that.ajaxService.fetchSelectedObjects('getObjects',{"query": {"siteName":that.selectedSite},"collection":"live_data"}).subscribe(live_data => {
                //this.thisSitsDevices = live_data;
                that.thisSitsDevices = [];
                console.log('live_data',live_data);
                let flags = [], l = live_data.length, i;
            for( i=0; i<l; i++) {
                if( flags[live_data[i]._id.deviceId]) continue;
                flags[live_data[i]._id.deviceId] = true;
                that.thisSitsDevices.push(live_data[i]);
            }
            that.thisSitsDevices.sort((a:any, b:any) => ('' + a.deviceName).localeCompare(b.deviceName));
            });*/
        }, 60000);
        console.log('URL history', this.variablesService.homeSelectedSiteName, this.variablesService.homeSelectedRow);
        //Auto expand of previus selected device
        if (this.variablesService.isFromOverview) {
            if (this.variablesService.homeSelectedSiteName != undefined && this.variablesService.selctedDeviceName != undefined) {
                this.expandDevice(this.variablesService.homeSelectedSiteName, this.variablesService.homeSelectedRow);
                //this.variablesService.homeSelectedRow = undefined;			
            }
            this.variablesService.isFromOverview = false;
        }
        $('.collapse').on('show.bs.collapse', function () {
            $('.collapse.in').collapse('hide');
        });
        function formatDate(subtractDate) {
            return moment().subtract(subtractDate, 'days').format('YYYY-MM-DD');
        }
        var today = formatDate(0);
        var beforeDay = formatDate(1);
        var beforeTwoDays = formatDate(2);
        var beforeThreeDays = formatDate(3);
        var beforeFourDays = formatDate(4);
        var beforeFiveDays = formatDate(5);
        var beforeSixDays = formatDate(6);
        /*this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"monthly_datas"}).subscribe(monthly_datas => {
            this.monthlyDatas = monthly_datas;
            this.monthlyDatas.reverse();
            energyGeneration = ['Energy Generation'];
            energyConsumption = ['Energy Consumption'];
            energySaved = ['Energy Saved'];
            months = [];
            for(let monthlyData of this.monthlyDatas) {
                energyGeneration.push(monthlyData.energyGeneration)
                energyConsumption.push(monthlyData.energyConsumption)
                energySaved.push(monthlyData.energyGeneration - monthlyData.energyConsumption)
                //let date = moment(monthlyData.date)['_i'];
                months.push(monthlyData.month.slice(0, 3))
            }
            loadChart();
        });*/
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": {}, "collection": "month_wise_data" }).subscribe(function (month_wise_data) {
            month_wise_data.sort(function (a, b) { return parseFloat(a.dateString) - parseFloat(b.dateString); });
            /*month_wise_data.sort(function(a:any,b:any) {
                a = a.dateString.split("-");
                b = b.dateString.split("-")
                return new Date(a[1], a[0], 1) - new Date(b[1], b[0], 1)
            });*/
            console.log(month_wise_data);
            var monthString = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May',
                'Jun', 'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec'
            ];
            energyGeneration = ['Energy Generation'];
            energyConsumption = ['Energy Consumption'];
            energySaved = ['Energy Saved'];
            months = [];
            for (var _i = 0, month_wise_data_1 = month_wise_data; _i < month_wise_data_1.length; _i++) {
                var monthlyData = month_wise_data_1[_i];
                energyGeneration.push(monthlyData.EGeneration);
                energyConsumption.push(monthlyData.EConsumption);
                energySaved.push(monthlyData.EGeneration - monthlyData.EConsumption);
                console.log(monthString[0]);
                months.push(monthString[monthlyData._id.month - 1]);
            }
            //months.reverse();
            console.log('months', months);
            loadChart();
        });
        function loadChart() {
            chart1 = c3.generate({
                bindto: '#chart1',
                data: {
                    columns: [energyGeneration],
                    types: {
                        'Energy Generation': 'bar'
                    },
                    colors: {
                        'Energy Generation': '#008000'
                    },
                },
                zoom: {
                    enabled: true
                },
                axis: {
                    x: {
                        type: 'category',
                        categories: months
                    }
                }
            });
            chart2 = c3.generate({
                bindto: '#chart2',
                data: {
                    columns: [energyConsumption],
                    types: {
                        'Energy Consumption': 'area-spline'
                    },
                    colors: {
                        'Energy Consumption': '#00a3cc'
                    },
                },
                zoom: {
                    enabled: true
                },
                axis: {
                    x: {
                        type: 'category',
                        categories: months
                    }
                }
            });
            chart3 = c3.generate({
                bindto: '#chart3',
                data: {
                    columns: [energySaved],
                    types: {
                        'Energy Saved': 'bar'
                    },
                    colors: {
                        'Energy Saved': '#0040ff'
                    },
                },
                axis: {
                    x: {
                        type: 'category',
                        categories: months
                    }
                }
            });
        }
        NProgress.done();
    };
    ;
    SmartMeteringComponent.prototype.maximizeChart1 = function () {
        this.variablesService.hideChart1 = true;
        this.variablesService.hideChart3 = true;
        this.variablesService.hideTable = true;
        this.variablesService.maximizeChart2 = true;
        this.variablesService.disableMinimize = false;
        this.variablesService.disableMaximize = true;
        chart1.resize({ height: 530, width: 1000 });
    };
    SmartMeteringComponent.prototype.maximizeChart2 = function () {
        this.variablesService.hideChart2 = true;
        this.variablesService.hideChart3 = true;
        this.variablesService.hideTable = true;
        this.variablesService.maximizeChart1 = true;
        this.variablesService.disableMinimize = false;
        this.variablesService.disableMaximize = true;
        chart2.resize({ height: 530, width: 1000 });
    };
    SmartMeteringComponent.prototype.maximizeChart3 = function () {
        this.variablesService.hideChart1 = true;
        this.variablesService.hideChart2 = true;
        this.variablesService.hideTable = true;
        this.variablesService.maximizeChart3 = true;
        this.variablesService.disableMinimize = false;
        this.variablesService.disableMaximize = true;
        chart3.resize({ height: 530, width: 1000 });
    };
    SmartMeteringComponent.prototype.mninimize = function () {
        this.variablesService.hideChart1 = false;
        this.variablesService.hideChart2 = false;
        this.variablesService.hideChart3 = false;
        this.variablesService.hideTable = false;
        this.variablesService.maximizeChart1 = false;
        this.variablesService.maximizeChart2 = false;
        this.variablesService.maximizeChart3 = false;
        this.variablesService.disableMinimize = true;
        this.variablesService.disableMaximize = false;
        //chart1.load({url: '/src/app/smartmetering/data/genaration.json'});
        chart1.resize({ height: 250, width: 400 });
        chart2.resize({ height: 250, width: 400 });
        chart3.resize({ height: 250, width: 400 });
    };
    SmartMeteringComponent.prototype.expandDevice = function (siteName, event) {
        var _this = this;
        var that = this;
        this.showExpandedDevices = !this.showExpandedDevices;
        if (event) {
            this.showExpandedDevices ? event.target.className = 'caret-rotate-animation' : event.target.className = 'caret-rerotate-animation';
        }
        if (this.showExpandedDevices == true) {
            //function autoRefreshForDevice(){}
            this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "siteName": siteName }, "collection": "live_data" }).subscribe(function (live_data) {
                _this.thisSitsDevices = live_data;
                /*console.log('live_data',live_data);
                let flags = [], l = live_data.length, i;
            for( i=0; i<l; i++) {
                if( flags[live_data[i]._id.deviceId]) continue;
                flags[live_data[i]._id.deviceId] = true;
                this.thisSitsDevices.push(live_data[i]);
            }*/
                //this.thisSitsDevices.sort((a:any, b:any) => ('' + a.deviceName).localeCompare(b.deviceName));
            });
            this.timeIntervalForDeviceRefresh = setInterval(function () {
                var _this = this;
                that.ajaxService.fetchSelectedObjects('getObjects', { "query": { "siteName": siteName }, "collection": "live_data" }).subscribe(function (live_data) {
                    _this.thisSitsDevices = live_data;
                    /*that.thisSitsDevices = [];;
                    console.log('live_data',live_data);
                    let flags = [], l = live_data.length, i;
                    for( i=0; i<l; i++) {
                        if( flags[live_data[i]._id.deviceId]) continue;
                        flags[live_data[i]._id.deviceId] = true;
                        that.thisSitsDevices.push(live_data[i]);
                    }*/
                    //that.thisSitsDevices.sort((a:any, b:any) => ('' + a.deviceName).localeCompare(b.deviceName));
                });
            }, 60000);
        }
        else if (this.existingSiteName == siteName && !this.showExpandedDevices) {
            this.thisSitsDevices = [];
            clearInterval(this.timeIntervalForDeviceRefresh);
        }
        if (this.showExpandedDevices == false && this.prevSelectedRow != event) {
            this.thisSitsDevices = [];
            clearInterval(this.timeIntervalForDeviceRefresh);
            this.variablesService.homeSelectedRow.target.className = 'caret-rerotate-animation';
        }
        this.prevSelectedRow = event;
        this.existingSiteName = siteName;
        this.variablesService.homeSelectedSiteName = siteName;
        this.variablesService.homeSelectedRow = event;
    };
    /*existingExpandedDevice(){
        this.expandDevice(this.existingSiteName, this.prevSelectedRow)
    }*/
    SmartMeteringComponent.prototype.getSelectedColumn = function (selectedColumn) {
        this.selectedColumn = selectedColumn - 1;
    };
    SmartMeteringComponent.prototype.sorting = function (sortingOrder, property) {
        this.isAscending = !this.isAscending;
        var direction = (sortingOrder == 'ascending') ? 1 : -1;
        this.liveDatas.sort(function (a, b) {
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
    SmartMeteringComponent.prototype.trackByUniqueId = function (index, value) {
        return value.siteName + value.ts;
    };
    //search..
    SmartMeteringComponent.prototype.getSiteName = function (event) {
        var filter = event.target.value.toUpperCase();
        var rows = document.querySelector("#portfolio-table tbody").rows;
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
    SmartMeteringComponent.prototype.ngOnDestroy = function () {
        clearInterval(this.timeIntervalForRefresh);
    };
    SmartMeteringComponent = __decorate([
        core_1.Component({
            selector: 'energy-index',
            templateUrl: './assets/src/app/smartmetering/smartmetering.component.html'
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService, variables_service_1.VariablesService])
    ], SmartMeteringComponent);
    return SmartMeteringComponent;
}());
exports.SmartMeteringComponent = SmartMeteringComponent;
//# sourceMappingURL=smartmetering.component.js.map