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
var variables_service_1 = require("./../shared/services/variables.service");
var moment = require("moment");
var ajax_service_1 = require("./../shared/services/ajax.service");
var ReportsComponent = /** @class */ (function () {
    function ReportsComponent(ajaxService, varService, _router) {
        this.ajaxService = ajaxService;
        this.varService = varService;
        this._router = _router;
        this.showReportsData1 = true;
        this.showReportsData2 = false;
        this.showReportsData3 = false;
        this.reportTitle = "Monthly Report";
        this.dailyDatas = this.varService.filteredReportsData;
        console.log(this.varService.selctedSiteNameForReports);
        /*this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"daily_datas"}).subscribe(dailyDatas => {
            this.dailyDatas = dailyDatas;
        });*/
    }
    ReportsComponent.prototype.ngOnInit = function () {
        NProgress.start();
        this.currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
        this.currentUser = localStorage.getItem('currentUser');
        console.log(localStorage.getItem('currentUser'));
        //this.reportsHeader1 = ['Date','Energy Generation (kWh)', 'Energy Consumption', 'Solar Voltage', 'Solar Current', 'Battery Voltage', 'Battery Current', 'Battery Charging', 'Battery Consumption', 'Light Status', 'Alarm'];
        //this.reportsHeader2 = ['Year','Energy Generation (kWh)', 'Energy Consumption', 'Solar Voltage', 'Solar Current', 'Battery Voltage', 'Battery Current', 'Battery Charging', 'Battery Consumption', 'Light Status', 'Alarm'];
        this.reportsHeaders = this.reportsHeader1;
        NProgress.done();
    };
    ReportsComponent.prototype.dynamicReports = function (reportsDtata) {
        if (reportsDtata == 'reportsDtata1') {
            this.reportsHeaders = this.reportsHeader1;
            this.showReportsData1 = true;
            this.showReportsData2 = false;
            this.showReportsData3 = false;
            this.reportTitle = "Monthly Report";
        }
        else if (reportsDtata == 'reportsDtata2') {
            //this.dynamicReportDatas = this.reportsDtata2;
            this.reportsHeaders = this.reportsHeader2;
            this.showReportsData1 = false;
            this.showReportsData2 = true;
            this.showReportsData3 = false;
            this.reportTitle = "Yearly Report";
        }
        /*else if(reportsDtata == 'reportsDtata3'){
            this.reportsHeaders = this.reportsHeader3;
            this.showReportsData1 = false;
            this.showReportsData2 = false;
            this.showReportsData3 = true;
            this.reportTitle = "Report 3";
        }*/
        //console.log('reportsDtata',this.dynamicReportDatas);
        //$(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip();
        //});
    };
    ReportsComponent.prototype.trackByIndex = function (index) {
        return index;
    };
    ReportsComponent.prototype.exportData = function (e) {
        var blob = new Blob([document.getElementById('exportable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Report.xls");
        /* window.open('data:application/vnd.ms-excel,' + $('#exportable').html());
       e.preventDefault(); */
    };
    ReportsComponent = __decorate([
        core_1.Component({
            selector: 'reports-comonent',
            templateUrl: './assets/src/app/reports/reports.components.html'
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService, variables_service_1.VariablesService, router_1.Router])
    ], ReportsComponent);
    return ReportsComponent;
}());
exports.ReportsComponent = ReportsComponent;
//# sourceMappingURL=reports.components.js.map