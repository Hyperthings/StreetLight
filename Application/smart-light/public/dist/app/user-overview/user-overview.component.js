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
var ajax_service_1 = require("./../shared/services/ajax.service");
var variables_service_1 = require("./../shared/services/variables.service");
var UserOverviewComponent = /** @class */ (function () {
    function UserOverviewComponent(_router, variablesService, ajaxService) {
        var _this = this;
        this._router = _router;
        this.variablesService = variablesService;
        this.ajaxService = ajaxService;
        NProgress.start();
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": {}, "collection": "users" }).subscribe(function (usereDetails) {
            console.log(usereDetails);
            _this.usereDetails = usereDetails;
        });
        NProgress.done();
    }
    UserOverviewComponent.prototype.ngOnInit = function () {
        this.roles = ["Super Admin", "Admin", "User"];
    };
    UserOverviewComponent.prototype.addRole = function (usereDetail) {
        this.selectedUserDetails = usereDetail;
        $('#myModal').modal('show');
        console.log("this.selectedUser", this.selectedUserDetails);
    };
    UserOverviewComponent.prototype.selectedRole = function (role) {
        //alert("test");
        console.log("role", role);
        this.role = role;
    };
    UserOverviewComponent.prototype.saveAssignedRole = function () {
        this.selectedUserDetails.role = this.role;
        console.log("this.selectedUserDetails.role", this.selectedUserDetails);
        this.ajaxService.saveObject(this.selectedUserDetails, 'users').subscribe(function (obj) {
            if (obj) {
                //this._router.navigate(['user']);
            }
            else {
                console.log("Data Not Updated");
            }
        });
        /*var obj = {
            collection: 'users',
            data: this.selectedUserDetails
        }

        console.log("data:+++",obj);
        var url = '/api/updateObject/'+ obj.data._id;
        delete obj.data._id;*/
        /* this.apiService.updateObject(obj,url)
             .subscribe(obj => {
                   if(obj){
                     //this._router.navigate(['user']);
                   }else{
                     console.log("Data Not Updated")
                   }
             });
 */
    };
    UserOverviewComponent = __decorate([
        core_1.Component({
            selector: 'overview',
            templateUrl: './assets/src/app/user-overview/user-overview.component.html'
        }),
        __metadata("design:paramtypes", [router_1.Router, variables_service_1.VariablesService, ajax_service_1.AjaxService])
    ], UserOverviewComponent);
    return UserOverviewComponent;
}());
exports.UserOverviewComponent = UserOverviewComponent;
//# sourceMappingURL=user-overview.component.js.map