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
var WasteManagementComponent = /** @class */ (function () {
    function WasteManagementComponent(ajaxService, variablesService) {
        var _this = this;
        this.ajaxService = ajaxService;
        this.variablesService = variablesService;
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": {}, "collection": "light_controls" }).subscribe(function (light_controls) {
            _this.lightControls = light_controls;
            console.log(_this.lightControls);
        });
        this.variablesService.selectedMenu = "Smart Waste";
    }
    WasteManagementComponent.prototype.ngOnInit = function () {
        var rangeSlider = function () {
            var slider = $('.range-slider'), range = $('.range-slider-range'), value = $('.range-slider-value');
            slider.each(function () {
                value.each(function () {
                    var value = $(this).prev().attr('value');
                    $(this).html(value);
                });
                range.on('input', function () {
                    $(this).next(value).html(this.value);
                });
            });
        };
        rangeSlider();
    };
    WasteManagementComponent = __decorate([
        core_1.Component({
            selector: 'energy-index',
            templateUrl: './assets/src/app/wastemanagement/wastemanagement.component.html'
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService, variables_service_1.VariablesService])
    ], WasteManagementComponent);
    return WasteManagementComponent;
}());
exports.WasteManagementComponent = WasteManagementComponent;
//# sourceMappingURL=wastemanagement.component.js.map