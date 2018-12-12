import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AjaxService} from './../shared/services/ajax.service';
import {VariablesService} from './../shared/services/variables.service';
declare var NProgress: any;


@Component({
	selector: 'device',
	templateUrl: './assets/src/app/device-overview/device-overview.component.html'
})


export class DeviceOverviewComponent {
	
	public deviceDetails: any;
	
	constructor(private ajaxService: AjaxService, private variablesService:VariablesService){
		NProgress.start();
		this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"device_details"}).subscribe(deviceDetails => {

			console.log(deviceDetails);
			this.deviceDetails = deviceDetails;


		});
		//this.variablesService.selectedMenu ="Smart Public Space";
		NProgress.done();
	}


}