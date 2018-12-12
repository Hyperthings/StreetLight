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
var EconomyIndexComponent = /** @class */ (function () {
    function EconomyIndexComponent(ajaxService, variablesService) {
        var _this = this;
        this.ajaxService = ajaxService;
        this.variablesService = variablesService;
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "_id.solution": "EconomyIndex" }, "collection": "area_comparison" }).subscribe(function (economy_area) {
            //fetchSelectedObjects
            _this.polygons = economy_area;
        });
        this.variablesService.selectedMenu = "Economy";
    }
    EconomyIndexComponent.prototype.ngOnInit = function () {
        var chart = c3.generate({
            bindto: '#pichart1',
            data: {
                x: 'x',
                columns: [
                    // ['x', '6', '7AM', '8M', '9AM', '10AM', '11AM','12AM','1PM','2PM','3PM','4PM','5PM','6PM'],
                    ['x', 2010, 2011, 2012, 2013, 2014, 2015],
                    ['GDPper Capita(USD)', 34341, 34454, 35933, 37123, 38622, 39543]
                ],
                types: {
                    'GDPper Capita(USD)': 'bar'
                },
                colors: {
                    'GDPper Capita(USD)': '#5DADE2'
                }
            },
            legend: {
                show: false
            }
        });
        var chart1 = c3.generate({
            bindto: '#pichart2',
            data: {
                x: 'x',
                columns: [
                    ['x', '2006', '2007', '2008', '2009', '2010', '2011'],
                    ['Compensation of Employees', 79.80, 77.49, 77.22, 72.82, 72.63, 76.03],
                    ['Tax', 0.7, 1.5, 1.6, 2.1, 1.09, 0.87],
                    ['Operating surplus', 19.44, 21.01, 21.71, 26.09, 26.29, 23.10]
                ],
                groups: [
                    ['Compensation of Employees', 'Tax', 'Operating surplus']
                ],
                type: 'bar',
                labels: true
            },
            legend: {
                show: false
            }
        });
        var chart3 = c3.generate({
            bindto: '#pichart3',
            data: {
                x: 'x',
                columns: [
                    // ['x', '6', '7AM', '8M', '9AM', '10AM', '11AM','12AM','1PM','2PM','3PM','4PM','5PM','6PM'],
                    ['x', '2010', '2011', '2012', '2013', '2014', '2015', '2016'],
                    ['Money Value(AED Million)', 40100, 43100, 50300, 57200, 66100, 76600, 81300]
                ],
                types: {
                    'Money Value(AED Million)': 'bar'
                },
                colors: {
                    'Money Value(AED Million)': '#F5B041'
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
                        count: 4
                    }
                },
                x: {
                    tick: {
                        count: 3
                    }
                }
            }
        });
        var chart6 = c3.generate({
            bindto: '#pichart4',
            data: {
                columns: [
                    ['Oil Production(BBL/D/1K)', 2345, 2401, 2511, 2567, 2877, 2467, 3004, 3201],
                ],
                type: 'area-spline',
                colors: {
                    'Oil Production(BBL/D/1K)': '#5D6D7E'
                }
            },
            legend: {
                show: false
            },
            axis: {
                y: {
                    tick: {
                        count: 4
                    }
                },
                x: {
                    tick: {
                        count: 3
                    },
                    type: 'category',
                    categories: ['2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016']
                }
            }
        });
    };
    EconomyIndexComponent = __decorate([
        core_1.Component({
            selector: 'energy-index',
            templateUrl: './assets/src/app/economyindex/economyindex.component.html'
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService, variables_service_1.VariablesService])
    ], EconomyIndexComponent);
    return EconomyIndexComponent;
}());
exports.EconomyIndexComponent = EconomyIndexComponent;
//# sourceMappingURL=economyindex.component.js.map