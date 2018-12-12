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
var ajax_service_1 = require("./../shared/services/ajax.service");
var variables_service_1 = require("./../shared/services/variables.service");
var DeviceOverviewComponent = /** @class */ (function () {
    function DeviceOverviewComponent(ajaxService, variablesService) {
        var _this = this;
        this.ajaxService = ajaxService;
        this.variablesService = variablesService;
        NProgress.start();
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": {}, "collection": "device_details" }).subscribe(function (deviceDetails) {
            console.log(deviceDetails);
            _this.deviceDetails = deviceDetails;
        });
        //this.variablesService.selectedMenu ="Smart Public Space";
        NProgress.done();
    }
    DeviceOverviewComponent = __decorate([
        core_1.Component({
            selector: 'device',
            templateUrl: './assets/src/app/device-overview/device-overview.component.html'
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService, variables_service_1.VariablesService])
    ], DeviceOverviewComponent);
    return DeviceOverviewComponent;
}());
exports.DeviceOverviewComponent = DeviceOverviewComponent;
//# sourceMappingURL=device-overview.component.js.map