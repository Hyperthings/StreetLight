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
var ProjectComponent = (function () {
    function ProjectComponent(ajaxService) {
        var _this = this;
        this.ajaxService = ajaxService;
        this.ajaxService.getObject("getAllObjects/project").subscribe(function (projects) { return _this.projects = projects; });
    }
    ProjectComponent.prototype.ngOnInit = function () {
        this.project = {
            projectId: '',
            title: '',
            description: '',
            modules: 0,
            testcases: 0,
        };
    };
    ProjectComponent.prototype.save = function (model, isValid) {
        var _this = this;
        model.testcases = 0;
        model.modules = 0;
        // check if model is valid
        // if valid, call API to save customer
        this.ajaxService.saveObject(model, 'project');
        this.ajaxService.getObject("getAllObjects/project").subscribe(function (projects) { return _this.projects = projects; });
    };
    ProjectComponent = __decorate([
        core_1.Component({
            selector: 'home',
            templateUrl: './assets/src/app/project/project.component.html',
        }), 
        __metadata('design:paramtypes', [ajax_service_1.AjaxService])
    ], ProjectComponent);
    return ProjectComponent;
}());
exports.ProjectComponent = ProjectComponent;
//# sourceMappingURL=project.component.js.map