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
require('rxjs/add/observable/fromEvent');
require('rxjs/add/observable/fromPromise');
require('rxjs/add/operator/map');
require('rxjs/add/operator/filter');
require('rxjs/add/operator/catch');
require('rxjs/add/operator/debounceTime');
require('rxjs/add/operator/distinctUntilChanged');
/*import 'rxjs/add/operator/flatMap';*/
require('rxjs/add/operator/toPromise');
var FunctionComponent = (function () {
    function FunctionComponent(ajaxService) {
        var _this = this;
        this.ajaxService = ajaxService;
        this.ajaxService.getObject("getAllObjects/function").subscribe(function (functions) { return _this.functions = functions; });
        /* let keyups= Observable.fromEvent<KeyboardEvent>($("#searchBox"),"keyup")
         .map(e => e.target.value)
         .filter(text => text.length >=3)
         .debounceTime(400)
         .distinctUntilChanged()
         .flatMap(searchTerm => {
           var url="searchObjects";
           var promise= $.getJSON(url);
           return Observable.fromPromise(promise);
         });
     
         keyups.subscribe(data => console.log(data));*/
    }
    FunctionComponent.prototype.ngOnInit = function () {
        this.function = {
            functionId: '',
            name: '',
            description: '',
            testSteps: [],
            parameters: []
        };
        this.tempTestStep = {
            description: '',
            keyword: '',
            object: ''
        };
    };
    FunctionComponent.prototype.save = function (model, isValid) {
        var _this = this;
        // check if model is valid
        // if valid, call API to save customer
        this.ajaxService.saveObject(this.function, 'function');
        this.ajaxService.getObject("getAllObjects/function").subscribe(function (functions) { return _this.functions = functions; });
    };
    FunctionComponent.prototype.pushTestStep = function (tempTestStep, event) {
        if (event.charCode == 13) {
            var len = this.function.testSteps.length;
            this.function.testSteps.push(tempTestStep);
            this.tempTestStep = {
                description: '',
                keyword: '',
                object: ''
            };
        }
    };
    FunctionComponent.prototype.searchParameters = function (tempParamWord, event) {
        if (event.charCode == 13) {
            var tempParam = {
                name: tempParamWord,
                value: '',
                description: ''
            };
            this.function.parameters.push(tempParam);
        }
    };
    FunctionComponent = __decorate([
        core_1.Component({
            selector: 'home',
            templateUrl: './assets/src/app/function/function.component.html',
        }), 
        __metadata('design:paramtypes', [ajax_service_1.AjaxService])
    ], FunctionComponent);
    return FunctionComponent;
}());
exports.FunctionComponent = FunctionComponent;
//# sourceMappingURL=function.component.js.map