import {Routes, RouterModule} from '@angular/router';


import {LoginComponent} from './login/login.component';
import {CityOverviewComponent} from './cityoverview/cityoverview.component';
import {HappinessIndexComponent} from './happinessindex/happinessindex.component';
import {PopulationIndexComponent} from './populationindex/populationindex.component';
import {SmartBuildingComponent} from './smartbuilding/smartbuilding.component';
import {SmartStreetComponent} from './smartstreet/smartstreet.component';
import {EnvironmentIndexComponent} from './environmentindex/environmentindex.component';
import {WasteManagementComponent} from './wastemanagement/wastemanagement.component';
import {EducationIndexComponent} from './educationindex/educationindex.component';
import {OverviewComponent} from './overview/overview.component';
import {EconomyIndexComponent} from './economyindex/economyindex.component';
import {HealthIndexComponent} from './healthindex/healthindex.component';
import {InfrastructureIndexComponent} from './infrastructureindex/infrastructureindex.component';
import {SmartParkingComponent} from './smartparking/smartparking.component';
import {SmartTransportationComponent} from './smarttransportation/smarttransportation.component';
import {SmartMeteringComponent} from './smartmetering/smartmetering.component';
import {SmartIrrigationComponent} from './smartirrigation/smartirrigation.component';
import {AlarmManagementComponent} from './alarm-management/alarm-management.component'
import {ReportsComponent} from './reports/reports.components';
import {DeviceOverviewComponent} from './device-overview/device-overview.component';
import {SiteOverviewComponent} from './site-overview/site-overview.component';
import {AddDeviceComponent} from './add-device/add-device.component';
import {AddSiteComponent} from './add-site/add-site.component';
import {UserOverviewComponent} from './user-overview/user-overview.component';
import {AddUserComponent} from './add-user/add-user.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {ReportsFilterComponent} from './reports-filter/reports-filter.components';

const appRoutes: Routes = [
    { path: '', component: LoginComponent },  
    { path: 'login', component: LoginComponent },
    { path: 'home', component: SmartMeteringComponent }, // using smart metring
    /*{ path: 'happiness', component: HappinessIndexComponent },
    { path: 'population', component: PopulationIndexComponent },*/
    //{ path: 'siteoverview', component: OverviewComponent },
    { path: 'energy-index', component: SmartIrrigationComponent },
    //{ path: 'energy-index/:id', component: SmartIrrigationComponent },
    //{path :'energy-index/:id/:id2',component:SmartIrrigationComponent},
    { path: 'scheduling', component: SmartStreetComponent },
    {path : 'remote',component:WasteManagementComponent},
    {path:'analytics',component:CityOverviewComponent},
    {path :'lighting-remote',component:SmartParkingComponent},
    {path :'lighting-scheduling',component:SmartTransportationComponent},
    //{path :'lighting-scheduling/:id',component:SmartTransportationComponent},
    {path :'alarm',component:AlarmManagementComponent},
    {path : 'liveData',component:EnvironmentIndexComponent},
    //{path : 'liveData/:id',component:EnvironmentIndexComponent},
    {path : 'reports',component:ReportsComponent},
    {path : 'reports-filter',component:ReportsFilterComponent},
    {path : 'device',component:DeviceOverviewComponent},
    {path : 'site',component:SiteOverviewComponent},
    {path : 'add-device',component:AddDeviceComponent},
    //{path : 'add-device/:id',component:AddDeviceComponent},
    {path : 'add-site',component:AddSiteComponent},
    {path : 'user',component:UserOverviewComponent},
    {path : 'add-user',component:AddUserComponent},
    {path :'infrastructure-index',component:InfrastructureIndexComponent},
    {path : '**', component: PageNotFoundComponent}

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

export const appRoutingProviders: any[] = [];

export const routing = RouterModule.forRoot(appRoutes);
