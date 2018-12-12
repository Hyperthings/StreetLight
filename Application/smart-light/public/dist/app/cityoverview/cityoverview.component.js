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
var CityOverviewComponent = /** @class */ (function () {
    function CityOverviewComponent(ajaxService, variablesService) {
        /*this.variablesService.selectedMenu ="City Overview";
        this.ajaxService.getObject('getAllObjects/devices').subscribe(devices => {

            this.devices = devices;


        });


        */
        this.ajaxService = ajaxService;
        this.variablesService = variablesService;
    }
    CityOverviewComponent.prototype.ngOnInit = function () {
        NProgress.start();
        var chart2 = c3.generate({
            bindto: '#chart1',
            /*size: {
              height: 370,
          },*/
            data: {
                columns: [
                    ['ActivePower(kW)', 10, 26, 35, 45, 60, 80, 95, 101, 77, 58, 39, 26, 23, 8, 3],
                    ['POA(w/m2)', 20, 90, 120, 230, 350, 440, 530, 520, 430, 340, 250, 140, 80, 20, 10],
                    ['Energy(kWh)', 2, 5, 20, 30, 42, 48, 56, 62, 31, 28, 24, 18, 10, 6, 3],
                ],
                type: 'spline',
                axes: {
                    //data1: 'y',
                    'POA(w/m2)': 'y2'
                }
            },
            point: {
                show: false
            },
            legend: {
                show: true
            },
            axis: {
                y: {
                    tick: {
                        count: 0
                    }
                },
                y2: {
                    show: true
                },
                x: {
                    tick: {
                        count: 3
                    },
                    type: 'category',
                    categories: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
                }
            }
        });
        NProgress.done();
    };
    CityOverviewComponent = __decorate([
        core_1.Component({
            selector: 'city-overview',
            templateUrl: './assets/src/app/cityoverview/cityoverview.component.html'
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService, variables_service_1.VariablesService])
    ], CityOverviewComponent);
    return CityOverviewComponent;
}());
exports.CityOverviewComponent = CityOverviewComponent;
//# sourceMappingURL=cityoverview.component.js.map