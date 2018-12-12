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
var EnvironmentIndexComponent = /** @class */ (function () {
    function EnvironmentIndexComponent(ajaxService, route, variablesService) {
        this.ajaxService = ajaxService;
        this.route = route;
        this.variablesService = variablesService;
        this.selectedDeviceInfo = { _id: {} };
    }
    EnvironmentIndexComponent.prototype.ngOnInit = function () {
        var that = this;
        NProgress.start();
        function autoRefresh() {
            var selectedLiveDataDevice = JSON.parse(localStorage.getItem('selectedLiveDataDevice'));
            console.log('selectedLiveDataDevice', selectedLiveDataDevice);
            var siteName = selectedLiveDataDevice.siteName;
            var deviceName = selectedLiveDataDevice.deviceId;
            //that.selectedSiteName = siteName;
            that.selectedDeviceName = selectedLiveDataDevice.deviceName;
            that.ajaxService.fetchSelectedObjects('getObjects', { "query": { "siteName": siteName, "_id.deviceId": deviceName }, "collection": "live_data" }).subscribe(function (selectedSite) {
                if (moment(selectedSite[0].ts).subtract(5, 'hours').subtract(30, 'minutes') < moment().subtract(6, 'hours')) {
                    that.deviceStatusIcon = true;
                }
                that.selectedDeviceInfo = selectedSite[0];
            });
        }
        autoRefresh();
        this.timeIntervalForRefresh = setInterval(function () {
            autoRefresh();
        }, 60000);
        this.variablesService.isFromOverview = true;
        NProgress.done();
    };
    EnvironmentIndexComponent.prototype.ngOnDestroy = function () {
        clearInterval(this.timeIntervalForRefresh);
    };
    EnvironmentIndexComponent = __decorate([
        core_1.Component({
            selector: 'energy-index',
            templateUrl: './assets/src/app/environmentindex/environmentindex.component.html'
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService, router_1.ActivatedRoute, variables_service_1.VariablesService])
    ], EnvironmentIndexComponent);
    return EnvironmentIndexComponent;
}());
exports.EnvironmentIndexComponent = EnvironmentIndexComponent;
//# sourceMappingURL=environmentindex.component.js.map