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
var http_1 = require("@angular/http");
var http_2 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/throw");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/debounceTime");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/switchMap");
require("rxjs/add/operator/toPromise");
var AjaxService = /** @class */ (function () {
    function AjaxService(http) {
        this.http = http;
        this._baseUrl = "http://localhost:4000/";
    }
    AjaxService.prototype.getObject = function (url) {
        return this.http.get(url)
            // ...and calling .json() on the response to return data
            .map(function (res) { return res.json(); })
            //...errors if any
            .catch(function (error) { return Observable_1.Observable.throw(error.json().error || 'Server error'); });
    };
    AjaxService.prototype.fetchSelectedObjects = function (url, data) {
        var body = JSON.stringify({ data: data });
        var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.post(url, body, options)
            .map(function (res) { return res.json(); })
            //...errors if any
            .catch(function (error) { return Observable_1.Observable.throw(error.json().error || 'Server error'); });
    };
    /*saveObject(model:any, type:String) {
        let saveUrl= 'saveObject/' + type
        let body = JSON.stringify(model);
        //let headers = new Headers({ 'Content-Type': 'application/json' });
        //let options = new RequestOptions({ headers: headers });
        console.log(saveUrl)
        console.log(model)
        return this.http.post(saveUrl, model).subscribe(data => {
                console.log(data);
          }, error => {
              console.log(JSON.stringify(error.json()));
          });
            //.map(this.extractData)
            //.catch(this.handleError);
            

    }*/
    AjaxService.prototype.saveObject = function (model, type) {
        var saveUrl = 'saveObject/' + type;
        var body = JSON.stringify(model);
        /*let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });*/
        console.log(saveUrl);
        console.log(model);
        return this.http.post(saveUrl, model).map(function (res) { return res.json(); });
    };
    AjaxService.prototype.extractData = function (res) {
        var body = res.json();
        console.log("DATA", body);
        return body.data || {};
    };
    AjaxService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable_1.Observable.throw(errMsg);
    };
    AjaxService.prototype.fileUpload = function (data) {
        JSON.stringify(data[0].name);
        console.log('file', JSON.stringify(data[0].name));
        return this.http.post('fileUpload', data)
            .map(function (res) { return res.json(); })
            //...errors if any
            .catch(function (error) { return Observable_1.Observable.throw(error.json().error || 'Server error'); });
    };
    AjaxService.prototype.registration = function (url, data) {
        var body = JSON.stringify({ data: data });
        var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.post(url, body, options)
            .map(function (res) { return res.json(); })
            //...errors if any
            .catch(function (error) { return Observable_1.Observable.throw(error.json() || 'Server error'); });
    };
    AjaxService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], AjaxService);
    return AjaxService;
}());
exports.AjaxService = AjaxService;
//# sourceMappingURL=ajax.service.js.map