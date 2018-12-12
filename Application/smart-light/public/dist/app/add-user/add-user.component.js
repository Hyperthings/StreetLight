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
var AddUserComponent = /** @class */ (function () {
    function AddUserComponent(_router, variablesService, _location, ajaxService) {
        this._router = _router;
        this.variablesService = variablesService;
        this._location = _location;
        this.ajaxService = ajaxService;
        this.message = "New User Added Successfully";
        //public password : any;
        //public confirm : any;
        this.passwordAlert = true;
        this.name = this.variablesService.name;
        this.email = this.variablesService.email;
        this.password = this.variablesService.password;
        this.confirm = this.variablesService.confirm;
        this.companyName = this.variablesService.companyName;
        this._id = this.variablesService.id;
        this.hidePassword = this.variablesService.hidePassword;
        this.addOrUpdate = this.variablesService.addOrUpdate;
    }
    AddUserComponent.prototype.ngOnInit = function () {
        NProgress.start();
        this.user = new forms_1.FormGroup({
            name: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.minLength(2)]),
            email: new forms_1.FormControl('', forms_1.Validators.required),
            companyName: new forms_1.FormControl('', forms_1.Validators.required),
            phoneNumber: new forms_1.FormControl('', forms_1.Validators.required),
            _id: new forms_1.FormControl(''),
            password: new forms_1.FormControl('', forms_1.Validators.required),
            confirm: new forms_1.FormControl('', forms_1.Validators.required)
        });
        NProgress.done();
    };
    AddUserComponent.prototype.passwordMatch = function () {
        //console.log(this.password);
        if (this.password !== this.confirm) {
            this.passwordAlert = false;
        }
        else {
            this.passwordAlert = true;
        }
    };
    AddUserComponent.prototype.onSubmit = function (_a) {
        var value = _a.value, valid = _a.valid;
        console.log(value);
        this.ajaxService.saveObject(value, 'users');
        this._router.navigate(['/user']);
    };
    AddUserComponent = __decorate([
        core_1.Component({
            // moduleId: module.id,
            selector: 'add-user',
            providers: [ajax_service_1.AjaxService],
            templateUrl: './assets/src/app/add-user/add-user.component.html'
        }),
        __metadata("design:paramtypes", [router_1.Router, variables_service_1.VariablesService, common_1.Location, ajax_service_1.AjaxService])
    ], AddUserComponent);
    return AddUserComponent;
}());
exports.AddUserComponent = AddUserComponent;
//# sourceMappingURL=add-user.component.js.map