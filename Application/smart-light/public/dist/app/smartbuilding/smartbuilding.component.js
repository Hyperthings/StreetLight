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
var SmartBuildingComponent = /** @class */ (function () {
    function SmartBuildingComponent(ajaxService, variablesService) {
        var _this = this;
        this.ajaxService = ajaxService;
        this.variablesService = variablesService;
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "_id.solution": "SmartBuilding" }, "collection": "live_data" }).subscribe(function (smart_building) {
            _this.smart_building = smart_building;
        });
        this.variablesService.selectedMenu = "Smart Buildings";
    }
    SmartBuildingComponent.prototype.ngOnInit = function () {
        var chart1 = c3.generate({
            bindto: '#chart1',
            data: {
                columns: [
                    ['HVAC', 40],
                    ['Lighting', 50],
                    ['Others', 10],
                ],
                type: 'pie'
            }
        });
        var chart2 = c3.generate({
            bindto: '#chart2',
            data: {
                columns: [
                    ['AHU', 34, 25, 50],
                    ['Chiller', 30, 85, 20],
                    ['Other', 10, 45, 30],
                ],
                type: 'bar'
            },
            bar: {
                width: {
                    ratio: 0.5 // this makes bar width 50% of length between ticks
                }
                // or
                //width: 100 // this makes bar width 100px
            },
            axis: {
                y: {
                    tick: {
                        count: 2
                    }
                },
                x: {
                    type: 'category',
                    categories: ['Day 1', 'Day 2', 'Day 3']
                }
            }
        });
    };
    SmartBuildingComponent = __decorate([
        core_1.Component({
            selector: 'energy-index',
            templateUrl: './assets/src/app/smartbuilding/smartbuilding.component.html'
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService, variables_service_1.VariablesService])
    ], SmartBuildingComponent);
    return SmartBuildingComponent;
}());
exports.SmartBuildingComponent = SmartBuildingComponent;
//# sourceMappingURL=smartbuilding.component.js.map