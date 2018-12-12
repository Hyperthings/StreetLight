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
var ng2_cookies_1 = require("ng2-cookies/ng2-cookies");
var variables_service_1 = require("./../shared/services/variables.service");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(ajaxService, router, variablesService) {
        this.ajaxService = ajaxService;
        this.router = router;
        this.variablesService = variablesService;
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.credentials = {
            username: '',
            password: ''
        };
    };
    LoginComponent.prototype.login = function (model, isValid) {
        var _this = this;
        if (model.username == "htsuser" && model.password == "hts@123" || model.username == "demo" && model.password == "demo") {
            this.variablesService.login = true;
            localStorage.setItem('currentUser', model.username);
            ng2_cookies_1.Cookie.set("isLoggedin", "true", 1); //expires login in 30 minutes
            this.router.navigateByUrl("/home");
        }
        else if (model.username == "csuser" && model.password == "csuser@123") {
            this.variablesService.login = true;
            ng2_cookies_1.Cookie.set("isLoggedin", "true", 1); //expires login in 30 minutes
            this.router.navigateByUrl("/home");
        }
        else {
            this.showInvalidAlert = true;
            setTimeout(function () {
                _this.showInvalidAlert = false;
            }, 5000);
        }
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'login-component',
            templateUrl: './assets/src/app/login/login.component.html',
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
        __metadata("design:paramtypes", [ajax_service_1.AjaxService, router_1.Router, variables_service_1.VariablesService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map