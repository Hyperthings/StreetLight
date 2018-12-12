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
var PopulationIndexComponent = /** @class */ (function () {
    function PopulationIndexComponent(ajaxService, variablesService) {
        var _this = this;
        this.ajaxService = ajaxService;
        this.variablesService = variablesService;
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "_id.solution": "PeopleIndex" }, "collection": "area_comparison" }).subscribe(function (people_area) {
            _this.polygons = people_area;
        });
        this.variablesService.selectedMenu = "People";
    }
    PopulationIndexComponent.prototype.ngOnInit = function () {
        var chart = c3.generate({
            bindto: '#pichart2',
            data: {
                x: 'x',
                columns: [
                    ['x', '2011', '2012', '2013', '2014', '2015', '2016'],
                    ['Male(%)', 55, 57, 52, 59, 55, 60],
                    ['Female(%)', 45, 48, 41, 45, 50, 40]
                ],
                groups: [
                    ['Male(%)', 'Female(%)']
                ],
                type: 'bar',
                labels: true
            }
        });
        var chart1 = c3.generate({
            bindto: '#pichart1',
            data: {
                columns: [
                    ['Marriage', 89],
                    ['Divorce', 11]
                ],
                type: 'donut',
                colors: {
                    'Marriage': '#008000',
                    'Divorce': '#E41B17'
                },
            }
        });
        var chart2 = c3.generate({
            bindto: '#pichart3',
            data: {
                columns: [
                    ['Emirati', 18],
                    ['Other Arab Nations', 10.2],
                    ['Indian', 27],
                    ['Pakistani', 15.3],
                    ['Bangladeshi', 7.5],
                    ['Filipino', 12.7],
                    ['America', 0.3],
                    ['Other Counteries', 6.5]
                ],
                type: 'pie'
            },
            legend: {
                show: false
            }
        });
        var chart3 = c3.generate({
            bindto: '#pichart4',
            data: {
                columns: [
                    ['Permenant Residents', 2213845, 2327350, 2446675],
                    ['Temporary Residents', 1073375, 1081000, 1105500]
                ],
                type: 'bar',
                colors: {
                    'Permenant Residents': '#808080',
                    'Temporary Residents': '#2ca02c'
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
                        count: 2
                    }
                },
                x: {
                    type: 'category',
                    categories: ['2013', '2014', '2015']
                }
            }
        });
    };
    PopulationIndexComponent = __decorate([
        core_1.Component({
            selector: 'energy-index',
            templateUrl: './assets/src/app/populationindex/populationindex.component.html'
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService, variables_service_1.VariablesService])
    ], PopulationIndexComponent);
    return PopulationIndexComponent;
}());
exports.PopulationIndexComponent = PopulationIndexComponent;
//# sourceMappingURL=populationindex.component.js.map