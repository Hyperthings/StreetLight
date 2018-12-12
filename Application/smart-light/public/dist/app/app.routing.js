"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var login_component_1 = require("./login/login.component");
var cityoverview_component_1 = require("./cityoverview/cityoverview.component");
var smartstreet_component_1 = require("./smartstreet/smartstreet.component");
var environmentindex_component_1 = require("./environmentindex/environmentindex.component");
var wastemanagement_component_1 = require("./wastemanagement/wastemanagement.component");
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
var appRoutes = [
    { path: '', component: login_component_1.LoginComponent },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'home', component: smartmetering_component_1.SmartMeteringComponent },
    /*{ path: 'happiness', component: HappinessIndexComponent },
    { path: 'population', component: PopulationIndexComponent },*/
    //{ path: 'siteoverview', component: OverviewComponent },
    { path: 'energy-index', component: smartirrigation_component_1.SmartIrrigationComponent },
    //{ path: 'energy-index/:id', component: SmartIrrigationComponent },
    //{path :'energy-index/:id/:id2',component:SmartIrrigationComponent},
    { path: 'scheduling', component: smartstreet_component_1.SmartStreetComponent },
    { path: 'remote', component: wastemanagement_component_1.WasteManagementComponent },
    { path: 'analytics', component: cityoverview_component_1.CityOverviewComponent },
    { path: 'lighting-remote', component: smartparking_component_1.SmartParkingComponent },
    { path: 'lighting-scheduling', component: smarttransportation_component_1.SmartTransportationComponent },
    //{path :'lighting-scheduling/:id',component:SmartTransportationComponent},
    { path: 'alarm', component: alarm_management_component_1.AlarmManagementComponent },
    { path: 'liveData', component: environmentindex_component_1.EnvironmentIndexComponent },
    //{path : 'liveData/:id',component:EnvironmentIndexComponent},
    { path: 'reports', component: reports_components_1.ReportsComponent },
    { path: 'reports-filter', component: reports_filter_components_1.ReportsFilterComponent },
    { path: 'device', component: device_overview_component_1.DeviceOverviewComponent },
    { path: 'site', component: site_overview_component_1.SiteOverviewComponent },
    { path: 'add-device', component: add_device_component_1.AddDeviceComponent },
    //{path : 'add-device/:id',component:AddDeviceComponent},
    { path: 'add-site', component: add_site_component_1.AddSiteComponent },
    { path: 'user', component: user_overview_component_1.UserOverviewComponent },
    { path: 'add-user', component: add_user_component_1.AddUserComponent },
    { path: 'infrastructure-index', component: infrastructureindex_component_1.InfrastructureIndexComponent },
    { path: '**', component: page_not_found_component_1.PageNotFoundComponent }
    /*
    {path : 'wastemanagement',component:WasteManagementComponent},
    {path : 'education',component:EducationIndexComponent},
    {path:'overview',component:CityOverviewComponent},
    {path : 'economy',component:EconomyIndexComponent},
    {path : 'health',component:HealthIndexComponent},
    {path :'infrastructure',component:InfrastructureIndexComponent},
    {path :'parking',component:SmartParkingComponent},
    {path :'transportation',component:SmartTransportationComponent},
    {path :'metering',component:SmartMeteringComponent},
     {path :'irrigation',component:SmartIrrigationComponent}*/
];
exports.appRoutingProviders = [];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map