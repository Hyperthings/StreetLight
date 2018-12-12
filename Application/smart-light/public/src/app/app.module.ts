import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import { MyDateRangePickerModule } from 'mydaterangepicker';

import {AppComponent} from './app.component';
import {routing, appRoutingProviders} from './app.routing';
import {AjaxService} from './shared/services/ajax.service';
import {VariablesService} from './shared/services/variables.service';
import {ModalComponent} from './shared/components/modal/modal.component';
import {CardComponent} from './shared/components/card/card.component';
import {LoginComponent} from './login/login.component';
import {NavbarComponent} from './navbar/navbar.component';
import {BottomnavComponent} from './bottomnav/bottomnav.component';
import {TopnavComponent} from './topnav/topnav.component';
import {MapComponent} from './map/map.component';
import {HappinessIndexComponent} from './happinessindex/happinessindex.component';
import {PopulationIndexComponent} from './populationindex/populationindex.component';
import {CityOverviewComponent} from './cityoverview/cityoverview.component';
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
import {AlarmManagementComponent} from './alarm-management/alarm-management.component';
import {ReportsComponent} from './reports/reports.components';
import {DeviceOverviewComponent} from './device-overview/device-overview.component';
import {SiteOverviewComponent} from './site-overview/site-overview.component';
import {AddDeviceComponent} from './add-device/add-device.component';
import {AddSiteComponent} from './add-site/add-site.component';
import {UserOverviewComponent} from './user-overview/user-overview.component';
import {AddUserComponent} from './add-user/add-user.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {ReportsFilterComponent} from './reports-filter/reports-filter.components';



@NgModule({
    declarations: [
        AppComponent,
        ModalComponent,
        CardComponent,
        NavbarComponent,
        LoginComponent,
        BottomnavComponent,
        TopnavComponent,
        MapComponent,
        HappinessIndexComponent,
        PopulationIndexComponent,
        CityOverviewComponent,
        SmartBuildingComponent,
        SmartStreetComponent,
        EnvironmentIndexComponent,
        WasteManagementComponent,
        EducationIndexComponent,
        OverviewComponent,
        EconomyIndexComponent,
        HealthIndexComponent,
        InfrastructureIndexComponent,
        SmartParkingComponent,
        SmartTransportationComponent,
        SmartMeteringComponent,
        SmartIrrigationComponent,
        AlarmManagementComponent,
        ReportsComponent,
        DeviceOverviewComponent,
        SiteOverviewComponent,
        AddDeviceComponent,
        AddSiteComponent,
        UserOverviewComponent,
        AddUserComponent,
        PageNotFoundComponent,
        ReportsFilterComponent
       
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        routing,
        FormsModule, 
        ReactiveFormsModule,
        MyDateRangePickerModule
    ],
    exports: [
    AppComponent,
    NavbarComponent,
        
       
        
       
    ],
    providers: [ AjaxService,  VariablesService, appRoutingProviders],
    bootstrap: [AppComponent]
})

export class AppModule {
}
