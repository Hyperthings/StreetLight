"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var mydaterangepicker_1 = require("mydaterangepicker");
var app_component_1 = require("./app.component");
var app_routing_1 = require("./app.routing");
var ajax_service_1 = require("./shared/services/ajax.service");
var variables_service_1 = require("./shared/services/variables.service");
var modal_component_1 = require("./shared/components/modal/modal.component");
var card_component_1 = require("./shared/components/card/card.component");
var login_component_1 = require("./login/login.component");
var navbar_component_1 = require("./navbar/navbar.component");
var bottomnav_component_1 = require("./bottomnav/bottomnav.component");
var topnav_component_1 = require("./topnav/topnav.component");
var map_component_1 = require("./map/map.component");
var happinessindex_component_1 = require("./happinessindex/happinessindex.component");
var populationindex_component_1 = require("./populationindex/populationindex.component");
var cityoverview_component_1 = require("./cityoverview/cityoverview.component");
var smartbuilding_component_1 = require("./smartbuilding/smartbuilding.component");
var smartstreet_component_1 = require("./smartstreet/smartstreet.component");
var environmentindex_component_1 = require("./environmentindex/environmentindex.component");
var wastemanagement_component_1 = require("./wastemanagement/wastemanagement.component");
var educationindex_component_1 = require("./educationindex/educationindex.component");
var overview_component_1 = require("./overview/overview.component");
var economyindex_component_1 = require("./economyindex/economyindex.component");
var healthindex_component_1 = require("./healthindex/healthindex.component");
var infrastructureindex_component_1 = require("./infrastructureindex/infrastructureindex.component");
var smartparking_component_1 = require("./smartparking/smartparking.component");
var smarttransportation_component_1 = require("./smarttransportation/smarttransportation.component");
var smartmetering_component_1 = require("./smartmetering/smartmetering.component");
var smartirrigation_component_1 = require("./smartirrigation/smartirrigation.component");
var alarm_management_component_1 = require("./alarm-management/alarm-management.component");
var reports_components_1 = require("./reports/reports.components");
var device_overview_component_1 = require("./device-overview/device-overview.component");
var site_overview_component_1 = require("./site-overview/site-overview.component");
var add_device_component_1 = require("./add-device/add-device.component");
var add_site_component_1 = require("./add-site/add-site.component");
var user_overview_component_1 = require("./user-overview/user-overview.component");
var add_user_component_1 = require("./add-user/add-user.component");
var page_not_found_component_1 = require("./page-not-found/page-not-found.component");
var reports_filter_components_1 = require("./reports-filter/reports-filter.components");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                modal_component_1.ModalComponent,
                card_component_1.CardComponent,
                navbar_component_1.NavbarComponent,
                login_component_1.LoginComponent,
                bottomnav_component_1.BottomnavComponent,
                topnav_component_1.TopnavComponent,
                map_component_1.MapComponent,
                happinessindex_component_1.HappinessIndexComponent,
                populationindex_component_1.PopulationIndexComponent,
                cityoverview_component_1.CityOverviewComponent,
                smartbuilding_component_1.SmartBuildingComponent,
                smartstreet_component_1.SmartStreetComponent,
                environmentindex_component_1.EnvironmentIndexComponent,
                wastemanagement_component_1.WasteManagementComponent,
                educationindex_component_1.EducationIndexComponent,
                overview_component_1.OverviewComponent,
                economyindex_component_1.EconomyIndexComponent,
                healthindex_component_1.HealthIndexComponent,
                infrastructureindex_component_1.InfrastructureIndexComponent,
                smartparking_component_1.SmartParkingComponent,
                smarttransportation_component_1.SmartTransportationComponent,
                smartmetering_component_1.SmartMeteringComponent,
                smartirrigation_component_1.SmartIrrigationComponent,
                alarm_management_component_1.AlarmManagementComponent,
                reports_components_1.ReportsComponent,
                device_overview_component_1.DeviceOverviewComponent,
                site_overview_component_1.SiteOverviewComponent,
                add_device_component_1.AddDeviceComponent,
                add_site_component_1.AddSiteComponent,
                user_overview_component_1.UserOverviewComponent,
                add_user_component_1.AddUserComponent,
                page_not_found_component_1.PageNotFoundComponent,
                reports_filter_components_1.ReportsFilterComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                http_1.JsonpModule,
                app_routing_1.routing,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                mydaterangepicker_1.MyDateRangePickerModule
            ],
            exports: [
                app_component_1.AppComponent,
                navbar_component_1.NavbarComponent,
            ],
            providers: [ajax_service_1.AjaxService, variables_service_1.VariablesService, app_routing_1.appRoutingProviders],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map