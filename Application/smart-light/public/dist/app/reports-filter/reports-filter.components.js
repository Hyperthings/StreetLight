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
//import {IMyDrpOptions, IMyDateRangeModel} from 'mydaterangepicker';
var moment = require("moment");
var ajax_service_1 = require("./../shared/services/ajax.service");
var variables_service_1 = require("./../shared/services/variables.service");
var ReportsFilterComponent = /** @class */ (function () {
    /*myDateRangePickerOptions: IMyDrpOptions = {
        dateFormat: 'dd/mm/yyyy'
    };*/
    function ReportsFilterComponent(ajaxService, varService, _router) {
        var _this = this;
        this.ajaxService = ajaxService;
        this.varService = varService;
        this._router = _router;
        this.siteName = 'All Sites';
        this.deviceName = 'All Devices';
        this.category = 'Day';
        this.isDaySelected = true;
        this.liveDatas = [];
        this.AllDevices = [];
        this.allSites = [];
        this.ajaxService.fetchSelectedObjects('getDistinctObjects', { "query": "_id.deviceId", "collection": "live_data" }).subscribe(function (allDevices) {
            _this.AllDevices = allDevices;
            _this.AllDevices.sort();
        });
        this.ajaxService.fetchSelectedObjects('getDistinctObjects', { "query": "siteName", "collection": "live_data" }).subscribe(function (allSites) {
            _this.allSites = allSites;
            _this.allSites.sort();
        });
    }
    ReportsFilterComponent.prototype.ngOnInit = function () {
        NProgress.start();
        /*this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"live_data"}).subscribe(live_data => {
            //this.liveDatas = live_data;

            //for get distinct objects
            var flags = [], l = live_data.length, i;
            for( i=0; i<l; i++) {
                if( flags[live_data[i]._id.siteName]) continue;
                flags[live_data[i]._id.siteName] = true;
                this.allSites. push(live_data[i]._id.siteName);
                this.allSites.sort();
            }

            var deviceFlags = [], l = live_data.length, i;
            for( i=0; i<l; i++) {
                if( deviceFlags[live_data[i]._id.deviceId]) continue;
                deviceFlags[live_data[i]._id.deviceId] = true;
                this.AllDevices. push(live_data[i]._id.deviceId);
                this.AllDevices.sort();
            }
        });*/
        var that = this;
        $("input").daterangepicker({
            minDate: moment().subtract(2, 'years'),
            ranges: {
                'Last 7 days': [moment().subtract(6, 'days'), moment()],
                'Last 15 days': [moment().subtract(14, 'days'), moment()],
                'Last 30 days': [moment().subtract(29, 'days'), moment()]
            },
            periods: ['day', 'month', 'quarter', 'year']
        }, function (startDate, endDate, period) {
            $(this).val(startDate.format('L') + ' – ' + endDate.format('L'));
            that.ts = {
                'startDate': startDate,
                'endDate': endDate
            };
            console.log('startDate', that.ts);
        });
        NProgress.done();
    };
    ReportsFilterComponent.prototype.getSiteName = function (selectedSitName) {
        var _this = this;
        this.siteName = selectedSitName;
        //alert(this.siteName);
        var getSiteDetailsQuery = {};
        if (this.siteName == 'All Sites') {
            getSiteDetailsQuery = {};
        }
        else {
            getSiteDetailsQuery = { "siteName": selectedSitName };
        }
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": getSiteDetailsQuery, "collection": "live_data" }).subscribe(function (live_data) {
            //this.liveDatas = live_data;
            console.log(live_data);
            _this.AllDevices = [];
            var deviceFlags = [], l = live_data.length, i;
            for (i = 0; i < l; i++) {
                if (deviceFlags[live_data[i].deviceName])
                    continue;
                deviceFlags[live_data[i].deviceName] = true;
                _this.AllDevices.push(live_data[i].deviceName);
                _this.AllDevices.sort();
            }
        });
    };
    ReportsFilterComponent.prototype.getSelectedReports = function () {
        var _this = this;
        NProgress.start();
        document.getElementById("openModalButton").click();
        this.varService.selctedSiteNameForReports = this.siteName;
        if (this.siteName == 'All Sites') {
            this.siteName = undefined;
        }
        if (this.deviceName == 'All Devices') {
            this.deviceName = undefined;
        }
        var selectedCatecories = {
            "_id.ts": this.ts,
            "siteName": this.siteName,
            "deviceName": this.deviceName
        };
        console.log(selectedCatecories);
        this.ajaxService.fetchSelectedObjects('reportsData', { "query": selectedCatecories, "collection": "history" }).subscribe(function (history) {
            console.log(history);
            _this.varService.filteredReportsData = history;
            $('#exampleModal').modal('hide');
            _this._router.navigate(['/reports']);
        });
        NProgress.done();
    };
    ReportsFilterComponent = __decorate([
        core_1.Component({
            selector: 'reports-filter',
            templateUrl: './assets/src/app/reports-filter/reports-filter.components.html'
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService, variables_service_1.VariablesService, router_1.Router])
    ], ReportsFilterComponent);
    return ReportsFilterComponent;
}());
exports.ReportsFilterComponent = ReportsFilterComponent;
//# sourceMappingURL=reports-filter.components.js.map