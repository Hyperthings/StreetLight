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
var core_1 = require('@angular/core');
var ajax_service_1 = require('./../shared/services/ajax.service');
var ModuleComponent = (function () {
    function ModuleComponent(ajaxService) {
        var _this = this;
        this.ajaxService = ajaxService;
        this.ajaxService.getObject("getAllObjects/project").subscribe(function (projects) {
            _this.projects = projects;
            _this.project = projects[0];
            _this.ajaxService.getObject("getAllObjects/module").subscribe(function (modules) { return _this.modules = modules; });
            _this.module = {
                projectId: _this.project.projectId,
                moduleId: '',
                title: '',
                description: '',
                testcases: 0,
            };
        });
    }
    ModuleComponent.prototype.ngOnInit = function () {
        this.module = {
            projectId: '',
            moduleId: '',
            title: '',
            description: '',
            testcases: 0,
        };
    };
    ModuleComponent.prototype.save = function (model, isValid) {
        var _this = this;
        model.testcases = 0;
        model.modules = 0;
        // check if model is valid
        // if valid, call API to save customer
        this.ajaxService.saveObject(model, 'module');
        this.ajaxService.getObject("getAllObjects/module").subscribe(function (modules) { return _this.modules = modules; });
    };
    ModuleComponent = __decorate([
        core_1.Component({
            selector: 'home',
            templateUrl: './assets/src/app/module/module.component.html'
        }), 
        __metadata('design:paramtypes', [ajax_service_1.AjaxService])
    ], ModuleComponent);
    return ModuleComponent;
}());
exports.ModuleComponent = ModuleComponent;
//# sourceMappingURL=module.component.js.map