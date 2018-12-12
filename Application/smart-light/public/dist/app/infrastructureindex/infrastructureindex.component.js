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
var router_1 = require("@angular/router");
var variables_service_1 = require("./../shared/services/variables.service");
var InfrastructureIndexComponent = /** @class */ (function () {
    function InfrastructureIndexComponent(ajaxService, variablesService, router) {
        this.ajaxService = ajaxService;
        this.variablesService = variablesService;
        this.router = router;
        this.showCaretSymbol = true;
        this.liveDatas = [];
        this.f_sl = 1;
        this.f_nm = 1;
        this.showErrorMsg = true;
        this.privilegeDetails = JSON.parse(localStorage.getItem('privilegeDetails'));
        /* this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"live_data"}).subscribe(live_data => {
           //this.liveDatas = live_data;
           live_data = live_data.reverse();
           var flags = [], l = live_data.length, i;
           for( i=0; i<l; i++) {
               if( flags[live_data[i].siteName]) continue;
               flags[live_data[i].siteName] = true;
               this.liveDatas.push(live_data[i]);
           }
         });
     */
        this.variablesService.selectedMenu = "Infrastructure";
    }
    InfrastructureIndexComponent.prototype.ngOnInit = function () {
        var that = this;
        function autoRefresh() {
            that.ajaxService.fetchSelectedObjects('getObjects', { "query": {}, "collection": "live_data" }).subscribe(function (live_data) {
                //for get distinct objects
                that.liveDatas = [];
                //live_data = live_data.reverse();
                var flags = [], l = live_data.length, i;
                for (i = 0; i < l; i++) {
                    if (flags[live_data[i].siteName])
                        continue;
                    flags[live_data[i].siteName] = true;
                    that.liveDatas.push(live_data[i]);
                }
                console.log(that.liveDatas);
            });
        }
        autoRefresh();
        this.timeIntervalForRefresh = setInterval(function () {
            autoRefresh();
        }, 60000);
        if (this.variablesService.isFromOverview) {
            if (this.variablesService.homeSelectedSiteName != undefined && this.variablesService.selctedDeviceName != undefined) {
                this.expandDevice(this.variablesService.homeSelectedSiteName, this.variablesService.homeSelectedRow);
                //this.variablesService.homeSelectedRow = undefined;      
            }
            this.variablesService.isFromOverview = false;
        }
    };
    InfrastructureIndexComponent.prototype.expandDevice = function (siteName, event) {
        var _this = this;
        var that = this;
        this.showExpandedDevices = !this.showExpandedDevices;
        this.showExpandedDevices ? event.target.className = 'caret-rotate-animation' : event.target.className = 'caret-rerotate-animation';
        if (this.showExpandedDevices == true) {
            this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "siteName": siteName }, "sortingKey": "deviceName", "sortingOrder": 1, "collection": "live_data" }).subscribe(function (live_data) {
                _this.thisSitsDevices = live_data;
                //this.thisSitsDevices.sort((a:any, b:any) => ('' + a.deviceName).localeCompare(b.deviceName));
            });
            this.timeIntervalForDeviceRefresh = setInterval(function () {
                var _this = this;
                that.ajaxService.fetchSelectedObjects('getObjects', { "query": { "siteName": siteName }, "sortingKey": "deviceName", "sortingOrder": 1, "collection": "live_data" }).subscribe(function (live_data) {
                    _this.thisSitsDevices = live_data;
                    /*that.thisSitsDevices = [];;
                    console.log('live_data',live_data);
                    let flags = [], l = live_data.length, i;
                    for( i=0; i<l; i++) {
                        if( flags[live_data[i]._id.deviceId]) continue;
                        flags[live_data[i]._id.deviceId] = true;
                        that.thisSitsDevices.push(live_data[i]);
                    }
                    that.thisSitsDevices.sort((a:any, b:any) => ('' + a.deviceName).localeCompare(b.deviceName));*/
                });
            }, 60000);
        }
        else if (this.existingSiteName == siteName && !this.showExpandedDevices) {
            this.thisSitsDevices = [];
            clearInterval(this.timeIntervalForDeviceRefresh);
        }
        if (this.showExpandedDevices == false && this.prevSelectedRow != event) {
            this.thisSitsDevices = [];
            clearInterval(this.timeIntervalForDeviceRefresh);
            this.variablesService.homeSelectedRow.target.className = 'caret-rerotate-animation';
        }
        this.prevSelectedRow = event;
        this.existingSiteName = siteName;
        this.variablesService.homeSelectedSiteName = siteName;
        this.variablesService.homeSelectedRow = event;
    };
    InfrastructureIndexComponent.prototype.getSelectedColumn = function (selectedColumn) {
        this.selectedColumn = selectedColumn - 1;
    };
    InfrastructureIndexComponent.prototype.sorting = function (sortingOrder, property) {
        this.isAscending = !this.isAscending;
        var direction = (sortingOrder == 'ascending') ? 1 : -1;
        this.liveDatas.sort(function (a, b) {
            if (sortingOrder == 'descending') {
                if (a[property] < b[property]) {
                    return -1 * direction;
                }
                else {
                    return 0;
                }
            }
            if (sortingOrder == 'ascending') {
                if (a[property] > b[property]) {
                    return 1 * direction;
                }
                else {
                    return 0;
                }
            }
        });
    };
    //search..
    InfrastructureIndexComponent.prototype.getSiteName = function (event) {
        var filter = event.target.value.toUpperCase();
        var rows = document.querySelector("#mytable tbody").rows;
        for (var i = 0; i < rows.length; i++) {
            var firstCol = rows[i].cells[0].textContent.toUpperCase();
            var secondCol = rows[i].cells[1].textContent.toUpperCase();
            var thirdCol = rows[i].cells[2].textContent.toUpperCase();
            if (this.selectedColumn == 0) {
                if (firstCol.indexOf(filter) > -1) {
                    rows[i].style.display = "";
                }
                else {
                    rows[i].style.display = "none";
                }
            }
            if (this.selectedColumn == 1) {
                if (secondCol.indexOf(filter) > -1) {
                    rows[i].style.display = "";
                }
                else {
                    rows[i].style.display = "none";
                }
            }
            /*
                    if (this.selectedColumn == 0) {
                     if (firstCol.indexOf(filter) > -1 || secondCol.indexOf(filter) > -1 || thirdCol.indexOf(filter) > -1) {
                        rows[i].style.display = "";
                    } else {
                        rows[i].style.display = "none";
                    }
                    }*/
        }
    };
    InfrastructureIndexComponent.prototype.deviceLiveData = function (siteName, deviceId, deviceName) {
        var selectedDevice = {
            'siteName': siteName, 'deviceId': deviceId, 'deviceName': deviceName
        };
        localStorage.setItem('selectedLiveDataDevice', JSON.stringify(selectedDevice));
        this.router.navigateByUrl('liveData');
    };
    InfrastructureIndexComponent.prototype.ngOnDestroy = function () {
        clearInterval(this.timeIntervalForRefresh);
        clearInterval(this.timeIntervalForDeviceRefresh);
    };
    InfrastructureIndexComponent = __decorate([
        core_1.Component({
            selector: 'infrastructure-index',
            templateUrl: './assets/src/app/infrastructureindex/infrastructureindex.component.html'
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService, variables_service_1.VariablesService, router_1.Router])
    ], InfrastructureIndexComponent);
    return InfrastructureIndexComponent;
}());
exports.InfrastructureIndexComponent = InfrastructureIndexComponent;
//# sourceMappingURL=infrastructureindex.component.js.map