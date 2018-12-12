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
var ng2_cookies_1 = require("ng2-cookies/ng2-cookies");
var variables_service_1 = require("./shared/services/variables.service");
var router_1 = require("@angular/router");
var AppComponent = /** @class */ (function () {
    function AppComponent(variablesService, router) {
        this.variablesService = variablesService;
        this.router = router;
        this.varService = variablesService;
    }
    AppComponent.prototype.ngOnInit = function () {
        this.currentUser = localStorage.getItem('currentUser');
        if (ng2_cookies_1.Cookie.get("isLoggedin") == "true") {
            this.variablesService.login = true;
            /*this.router.navigateByUrl("/projects");*/
        }
        else {
            this.router.navigateByUrl("/login");
        }
    };
    AppComponent.prototype.logout = function () {
        ng2_cookies_1.Cookie.get("isLoggedin") == "false";
        this.router.navigateByUrl("/login");
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: './assets/src/app/app.component.html'
        }),
        __metadata("design:paramtypes", [variables_service_1.VariablesService, router_1.Router])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map