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
var HealthIndexComponent = /** @class */ (function () {
    function HealthIndexComponent(ajaxService, variablesService) {
        var _this = this;
        this.ajaxService = ajaxService;
        this.variablesService = variablesService;
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "_id.solution": "HealthIndex" }, "collection": "area_comparison" }).subscribe(function (health_area) {
            _this.polygons = health_area;
        });
        this.variablesService.selectedMenu = "Health";
    }
    HealthIndexComponent.prototype.ngOnInit = function () {
        var chart1 = c3.generate({
            bindto: '#pichart2',
            data: {
                columns: [
                    ['Cardiovascular Disease', 297.6],
                    [' Cancer', 99],
                    ['Others', 200],
                ],
                type: 'pie'
            }
        });
        var chart5 = c3.generate({
            bindto: '#pichart3',
            data: {
                columns: [
                    ['Prevalence of Smoking', 21.6, 1.9, 23.5]
                ],
                type: 'bar',
                colors: {
                    'Prevalence of Smoking': '#1A5276',
                },
            },
            bar: {
                width: {
                    ratio: 0.5 // this makes bar width 50% of length between ticks
                }
                // or
                //width: 100 // this makes bar width 100px
            },
            axis: {
                rotated: true,
                y: {
                    tick: {
                        count: 3
                    }
                },
                x: {
                    type: 'category',
                    categories: ['Male', 'Female', 'Overall']
                }
            }
        });
        var chart3 = c3.generate({
            bindto: '#pichart4',
            data: {
                x: 'x',
                columns: [
                    // ['x', '6', '7AM', '8M', '9AM', '10AM', '11AM','12AM','1PM','2PM','3PM','4PM','5PM','6PM'],
                    ['x', '2010', '2011', '2012', '2013', '2014', '2015', '2016'],
                    ['Fertility Ratio', 2, 1.98, 1.95, 1.9, 1.87, 1.62, 1.6]
                ],
                types: {
                    'Fertility Ratio': 'bar'
                },
                colors: {
                    'Fertility Ratio': '#157DEC'
                }
            },
            bar: {
                width: {
                    ratio: 0.2 // this makes bar width 50% of length between ticks
                }
                // or
                //width: 100 // this makes bar width 100px
            },
            legend: {
                show: false
            },
            axis: {
                y: {
                    tick: {
                        count: 2
                    }
                },
                x: {
                    tick: {
                        count: 3
                    }
                }
            }
        });
    };
    HealthIndexComponent = __decorate([
        core_1.Component({
            selector: 'health-index',
            templateUrl: './assets/src/app/healthindex/healthindex.component.html'
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService, variables_service_1.VariablesService])
    ], HealthIndexComponent);
    return HealthIndexComponent;
}());
exports.HealthIndexComponent = HealthIndexComponent;
//# sourceMappingURL=healthindex.component.js.map