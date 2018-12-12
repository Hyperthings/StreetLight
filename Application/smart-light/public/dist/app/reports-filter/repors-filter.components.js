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
var ReporsFilterComponent = /** @class */ (function () {
    function ReporsFilterComponent(ajaxService) {
        this.ajaxService = ajaxService;
        this.myDateRangePickerOptions = {
            // other options...
            dateFormat: 'dd/mm/yyyy',
        };
        this.model = { beginDate: { year: 2018, month: 10, day: 9 },
            endDate: { year: 2018, month: 10, day: 19 } };
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": {}, "collection": "daily_datas" }).subscribe(function (dailyDatas) {
        });
    }
    ReporsFilterComponent.prototype.ngOnInit = function () {
        NProgress.start();
        NProgress.done();
    };
    ReporsFilterComponent = __decorate([
        core_1.Component({
            selector: 'reports-filter',
            templateUrl: './assets/src/app/reports-filter/reports-filter.components.html'
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService])
    ], ReporsFilterComponent);
    return ReporsFilterComponent;
}());
exports.ReporsFilterComponent = ReporsFilterComponent;
//# sourceMappingURL=repors-filter.components.js.map