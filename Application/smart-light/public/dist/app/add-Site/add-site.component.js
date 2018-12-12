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
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var ajax_service_1 = require("./../shared/services/ajax.service");
var variables_service_1 = require("./../shared/services/variables.service");
var AddSiteComponent = /** @class */ (function () {
    function AddSiteComponent(variablesService, _location, ajaxService, _router) {
        this.variablesService = variablesService;
        this._location = _location;
        this.ajaxService = ajaxService;
        this._router = _router;
        this.message = "New User Added Successfully";
        this.passwordAlert = true;
        this.showInvalidAlert = false;
        this.showSiteNameAvailableError = false;
        this.showSiteIdAvailableError = false;
    }
    AddSiteComponent.prototype.ngOnInit = function () {
        NProgress.start();
        this.user = new forms_1.FormGroup({
            siteName: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.minLength(2)]),
            solution: new forms_1.FormControl('EMS', forms_1.Validators.required),
            //siteName: new FormControl('', Validators.required),
            siteId: new forms_1.FormControl('', forms_1.Validators.required),
            longitude: new forms_1.FormControl('', forms_1.Validators.required),
            latitude: new forms_1.FormControl('', forms_1.Validators.required),
            address: new forms_1.FormControl('', forms_1.Validators.required),
        });
        NProgress.done();
    };
    AddSiteComponent.prototype.onSubmit = function (value) {
        var _this = this;
        var data = value['_value'];
        console.log(data);
        /*this.ajaxService.saveObject(data,'site_details').subscribe(site_details => {
          console.log("site_details",site_details)
       });*/
        if (this.user.valid) {
            this.ajaxService.saveObject(data, 'site_details').subscribe(function (device_details) {
                _this.popupStatusMessage = 'Site ' + device_details.message;
                console.log("_details", device_details.message);
                document.getElementById("openModalButton").click();
                _this.user = new forms_1.FormGroup({
                    siteName: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.minLength(2)]),
                    solution: new forms_1.FormControl('EMS', forms_1.Validators.required),
                    //siteName: new FormControl('', Validators.required),
                    siteId: new forms_1.FormControl('', forms_1.Validators.required),
                    longitude: new forms_1.FormControl('', forms_1.Validators.required),
                    latitude: new forms_1.FormControl('', forms_1.Validators.required),
                    address: new forms_1.FormControl('', forms_1.Validators.required),
                });
            });
        }
        else {
            var that_1 = this;
            this.showInvalidAlert = true;
            setTimeout(function () {
                that_1.showInvalidAlert = false;
            }, 5000);
        }
        //this._router.navigate(['/site']);
    };
    AddSiteComponent.prototype.checkSiteNameAvailability = function (siteName) {
        var _this = this;
        console.log(siteName);
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": { 'siteName': siteName }, "collection": "site_details" }).subscribe(function (site_details) {
            console.log('site_details', site_details);
            if (site_details.length > 0) {
                _this.showSiteNameAvailableError = true;
            }
            else if (site_details.length <= 0) {
                _this.showSiteNameAvailableError = false;
            }
        });
    };
    AddSiteComponent.prototype.checkSiteIdAvailability = function (siteId) {
        var _this = this;
        console.log(siteId);
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": { 'siteId': siteId }, "collection": "site_details" }).subscribe(function (site_details) {
            console.log('site_details', site_details);
            if (site_details.length > 0) {
                _this.showSiteIdAvailableError = true;
            }
            else if (site_details.length <= 0) {
                _this.showSiteIdAvailableError = false;
            }
        });
    };
    AddSiteComponent = __decorate([
        core_1.Component({
            selector: 'add-device',
            providers: [ajax_service_1.AjaxService],
            templateUrl: './assets/src/app/add-site/add-site.component.html',
            animations: [
                core_1.trigger('movePanel', [
                    core_1.transition('void => *', [
                        core_1.animate(600, core_1.keyframes([
                            core_1.style({ transform: 'translateX(25px)' }),
                            core_1.style({ transform: 'translateX(-25px)' }),
                            core_1.style({ transform: 'translateX(25px)' }),
                            core_1.style({ transform: 'translateX(-25px)' }),
                            core_1.style({ transform: 'translateX(25px)' }),
                            core_1.style({ transform: 'translateX(0)' }),
                        ]))
                    ]),
                    core_1.transition('* => void', [
                        core_1.animate(1000, core_1.keyframes([
                            core_1.style({ opacity: .8 }),
                            core_1.style({ opacity: .6 }),
                            core_1.style({ opacity: .4 }),
                            core_1.style({ opacity: .3 }),
                            core_1.style({ opacity: .2 }),
                            core_1.style({ opacity: .1 }),
                        ]))
                    ])
                ])
            ]
        }),
        __metadata("design:paramtypes", [variables_service_1.VariablesService, common_1.Location, ajax_service_1.AjaxService, router_1.Router])
    ], AddSiteComponent);
    return AddSiteComponent;
}());
exports.AddSiteComponent = AddSiteComponent;
//# sourceMappingURL=add-site.component.js.map