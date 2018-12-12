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
var EducationIndexComponent = /** @class */ (function () {
    function EducationIndexComponent(ajaxService, variablesService) {
        var _this = this;
        this.ajaxService = ajaxService;
        this.variablesService = variablesService;
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "_id.solution": "EducationIndex" }, "collection": "area_comparison" }).subscribe(function (education_area) {
            _this.polygons = education_area;
        });
        this.variablesService.selectedMenu = "Education";
    }
    EducationIndexComponent.prototype.ngOnInit = function () {
        var chart = c3.generate({
            bindto: '#pichart1',
            data: {
                columns: [
                    ['Male', 87, 89, 90, 92.2, 93.6],
                    ['Female', 88, 89.5, 91, 94, 97],
                ],
                types: {
                    'Male': 'spline',
                    'Female': 'spline',
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
        var chart2 = c3.generate({
            bindto: '#pichart2',
            data: {
                columns: [
                    ['Preschools', 93.40],
                    ['Upper Secondary', 93.10]
                ],
                type: 'pie'
            },
            donut: {
                title: "EnrollmentRate"
            }
        });
        var chart3 = c3.generate({
            bindto: '#pichart3',
            data: {
                x: 'x',
                columns: [
                    ['x', 2013, 2014, 2015, 2016],
                    ['Government', 60, 69, 79, 80],
                    ['Private', 160, 165, 172, 173]
                ],
                groups: [
                    ['Government', 'Private']
                ],
                type: 'bar',
                labels: true,
                colors: {
                    'Government': '#157DEC',
                    'Private': '#1D8348'
                }
            }
        });
        var chart4 = c3.generate({
            bindto: '#pichart4',
            data: {
                x: 'x',
                columns: [
                    // ['x', '6', '7AM', '8M', '9AM', '10AM', '11AM','12AM','1PM','2PM','3PM','4PM','5PM','6PM'],
                    ['x', 2008, 2009, 2010, 2011, 2012, 2013, 2014],
                    ['Unemployment Rate', 3.45, 3.71, 4.2, 4.3, 4.6, 4.2, 4.1]
                ],
                types: {
                    'Unemployment Rate': 'bar'
                },
                colors: {
                    'Unemployment Rate': '#32CD32'
                }
            },
            legend: {
                show: false
            }
        });
    };
    EducationIndexComponent = __decorate([
        core_1.Component({
            selector: 'energy-index',
            templateUrl: './assets/src/app/educationindex/educationindex.component.html'
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService, variables_service_1.VariablesService])
    ], EducationIndexComponent);
    return EducationIndexComponent;
}());
exports.EducationIndexComponent = EducationIndexComponent;
//# sourceMappingURL=educationindex.component.js.map