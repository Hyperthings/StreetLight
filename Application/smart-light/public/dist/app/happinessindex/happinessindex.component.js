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
var HappinessIndexComponent = /** @class */ (function () {
    function HappinessIndexComponent(ajaxService, variablesService) {
        var _this = this;
        this.ajaxService = ajaxService;
        this.variablesService = variablesService;
        this.variablesService.selectedMenu = "Happiness";
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "_id.solution": "HappinessIndex" }, "collection": "area_comparison" }).subscribe(function (happiness_area) {
            _this.polygons = happiness_area;
        });
    }
    HappinessIndexComponent.prototype.ngOnInit = function () {
    };
    HappinessIndexComponent.prototype.ngAfterViewInit = function () {
        var chart1 = c3.generate({
            bindto: '#chart1',
            data: {
                columns: [
                    ['Happy', 60],
                    ['Unhappy', 30],
                    ['Ideal', 10],
                ],
                type: 'pie'
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
                    categories: ['cat1', 'cat2', 'cat3']
                }
            }
        });
        var chart2 = c3.generate({
            bindto: '#chart2',
            data: {
                columns: [
                    ['Happiness Index', 50, 30, 60],
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
                    categories: ['2014', '2015', '2016']
                }
            }
        });
        //#2CA02C
        var chart = c3.generate({
            bindto: '#chart3',
            data: {
                columns: [
                    ['Income Level', 40, 60, 50, 55, 65],
                ],
                types: {
                    'Income Level': 'spline'
                },
                colors: {
                    'Income Level': '#2ca02c'
                }
            }, axis: {
                y: {
                    tick: {
                        count: 2
                    }
                },
                x: {
                    type: 'category',
                    categories: ['2012', '2013', '2014', '2015', '2016']
                }
            }
        });
    };
    HappinessIndexComponent = __decorate([
        core_1.Component({
            selector: 'energy-index',
            templateUrl: './assets/src/app/happinessindex/happinessindex.component.html'
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService, variables_service_1.VariablesService])
    ], HappinessIndexComponent);
    return HappinessIndexComponent;
}());
exports.HappinessIndexComponent = HappinessIndexComponent;
//# sourceMappingURL=happinessindex.component.js.map