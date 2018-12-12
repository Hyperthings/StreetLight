import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AjaxService} from './../shared/services/ajax.service';
import {VariablesService} from './../shared/services/variables.service';
declare var NProgress: any;


@Component({
	selector: 'site',
	templateUrl: './assets/src/app/site-overview/site-overview.component.html'
})

export class SiteOverviewComponent {
	public sitesDetails: any[] = [];
	showExpandedGateways: boolean;
	thisSitsGateways: any[] = [];
  	existingSiteName: string;
  	existingGatewayName: string;
  	showExpandedDevices: boolean;
  	thisSitsDevices: any;
    caretRotateAnimation :boolean;
    prevSelectedRow: any;
    popupStatusMessage: string;
    selectedSiteName: string;
    selectedGatewayName: string;
    popupResponseMessage: any ={};

	constructor(private ajaxService: AjaxService, private variablesService:VariablesService, private router:Router){
  let privilegeQuery = {$or: [{"siteName" : "HTS"},{"siteName" : "Site-2"}]};
		NProgress.start();
		this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"site_details"}).subscribe(sitesDetails => {
			this.sitesDetails = sitesDetails;
      this.sitesDetails.sort();

			/* let flags = [], l = sitesDetails.length, i;
		      for( i=0; i<l; i++) {
		          if( flags[sitesDetails[i].siteName]) continue;
		          flags[sitesDetails[i].siteName] = true;
		          this.sitesDetails.push(sitesDetails[i]);
		          this.sitesDetails.sort()
		      }*/

		});


		//this.variablesService.selectedMenu ="Smart Public Space";
		NProgress.done();
	}


	ngOnInit(){

	}

	expandGateway(siteName:string, event:any){
          this.thisSitsGateways=[];
          this.selectedSiteName = siteName;
        this.showExpandedGateways = !this.showExpandedGateways;
        this.showExpandedGateways ? event.target.className = 'caret-rotate-animation' : event.target.className = 'caret-rerotate-animation';
        if (this.showExpandedGateways == true) {
          this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"siteName":siteName},"collection":"gateway_details"}).subscribe(site_details => {
            //this.thisSitsGateways = site_details;
            let flags = [], l = site_details.length, i;
		      for( i=0; i<l; i++) {
		          if( flags[site_details[i].gatewayName]) continue;
		          flags[site_details[i].gatewayName] = true;
		          this.thisSitsGateways.push(site_details[i]);
		          this.thisSitsGateways.sort();
		      }
          });
        }
        else if(this.existingSiteName == siteName && !this.showExpandedGateways){
          this.thisSitsGateways=[];
        }
        
        if(this.showExpandedGateways == false && this.prevSelectedRow != event){
          this.prevSelectedRow.target.className = 'caret-rerotate-animation';
        }
        this.existingSiteName = siteName;
        this.prevSelectedRow = event;

        console.log('thisSitsGateways',this.thisSitsGateways);

       /* this.ajaxService.fetchSelectedObjects('getCounts',{"query": {},"collection":"live_data"}).subscribe(sitesDetails => {
          //this.sitesDetails = sitesDetails;

         console.log('sitesDetails',sitesDetails);

        });*/
      }

	expandDevice(siteName:string, gateway:string, event:any){
		this.thisSitsDevices=[];
    this.selectedSiteName = siteName;
    this.selectedGatewayName = gateway;
        this.showExpandedDevices = !this.showExpandedDevices;
        this.showExpandedDevices ? event.target.className = 'caret-rotate-animation' : event.target.className = 'caret-rerotate-animation';

        if (this.showExpandedDevices == true) {
          this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"siteName": siteName,"gatewayName": gateway},"collection":"device_details"}).subscribe(live_data => {
            this.thisSitsDevices = live_data;
          });
        }
        else if(this.existingGatewayName == gateway && !this.showExpandedDevices){
          this.thisSitsDevices=[];
        }
        if(this.showExpandedDevices == false && this.prevSelectedRow != event){
          this.prevSelectedRow.target.className = 'caret-rerotate-animation';
        }
        this.existingGatewayName = gateway;
        this.prevSelectedRow = event;
      }


      addGateway(selectedSite:string){
        this.variablesService.isFromGateway = true;
        this.variablesService.editGateway = false;
        this.variablesService.addGateway = true;
        this.variablesService.addDevice = false;
        this.variablesService.editDevice = false;
        localStorage.setItem('selctedGateway','');
        this.variablesService.selctedSiteName = selectedSite;
        this.router.navigate(['/add-device'])
      }

      editDevice(selctedDivices:any){
        this.variablesService.isFromGateway = false;
        this.variablesService.editGateway = false;
        this.variablesService.addGateway = false;
        this.variablesService.addDevice = false;
        this.variablesService.editDevice = true;
      	localStorage.setItem('selctedDivices',JSON.stringify(selctedDivices));

      	console.log(localStorage.getItem('selctedDivices'));
      	this.router.navigate(['/add-device'])
      }


      editGateway(thisSitsGateway:any){
         this.variablesService.selctedSiteGateway = false;
        this.variablesService.editGateway = true;
        this.variablesService.addGateway = false;
        this.variablesService.addDevice = false;
        this.variablesService.editDevice = false;
        localStorage.setItem('selctedGateway',JSON.stringify(thisSitsGateway));

        console.log(localStorage.getItem('selctedDivices'));
        this.router.navigate(['/add-device'])
      }
	    
      addDeviceForThisGateway(selectedSite:string, selectedGateway:string, selectedGatewayId:string){
        this.variablesService.editGateway = false;
        this.variablesService.addGateway = false;
        this.variablesService.addDevice = true;
        this.variablesService.editDevice = false;
         this.variablesService.selctedSiteGateway = true;
        localStorage.setItem('selctedSiteGateway',JSON.stringify({'selectedSite':selectedSite,'selectedGateway':selectedGateway, 'selectedGatewayId':selectedGatewayId}));

        console.log(localStorage.getItem('selctedSiteGateway'));
        this.router.navigate(['/add-device'])
      }

      deleteSite(siteDetails:any){
        console.log('siteDetails',siteDetails)
        this.ajaxService.fetchSelectedObjects('deleteObject',{"query": {'siteName':siteDetails.siteName},"collection":"site_details"}).subscribe(data => {
          console.log('data',data);
          this.popupStatusMessage = "Site Deleted "+data.statusMessage;
          document.getElementById("openModalButton").click();
          this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"site_details"}).subscribe(sitesDetails => {
            this.sitesDetails = sitesDetails;
            this.sitesDetails.sort();
          });
        });
      }

      deleteGateway(siteDetails:any, selectedGateway:any){
        console.log('gateway Details',selectedGateway.gatewayName)
        this.ajaxService.fetchSelectedObjects('deleteObject',{"query": {'siteName':siteDetails.siteName,'gatewayName':selectedGateway.gatewayName},"collection":"gateway_details"}).subscribe(data => {
            console.log('data',data);
          this.popupStatusMessage = "Gateway Deleted "+data.statusMessage;
          document.getElementById("openModalButton").click();
          this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"site_details"}).subscribe(sitesDetails => {
              this.sitesDetails = sitesDetails;
              this.sitesDetails.sort();
            });
          this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"siteName":this.selectedSiteName},"collection":"gateway_details"}).subscribe(site_details => {
            this.thisSitsGateways = [];
            let flags = [], l = site_details.length, i;
            for( i=0; i<l; i++) {
                if( flags[site_details[i].gatewayName]) continue;
                flags[site_details[i].gatewayName] = true;
                this.thisSitsGateways.push(site_details[i]);
                this.thisSitsGateways.sort();
            }
          });
        });
      }

      deleteDevice(siteDetails:any, selectedGateway:any, selectedDevice:any){
        console.log('device Details',selectedDevice)
        this.ajaxService.fetchSelectedObjects('deleteObject',{"query": {'siteName':siteDetails.siteName,'gatewayName':selectedGateway.gatewayName,'deviceName':selectedDevice.deviceName},"collection":"device_details"}).subscribe(data => {
            console.log('data',data);

             if(data.statusMessage == "Successfully"){

                let regData = { //"CommandID": new Date().getTime(), //Unix format as a Unique id 
                        "CommandID":Math.floor(100000000 + Math.random() * 900000000),
                       "Command":"delete", 
                       "MacAddress":selectedDevice.deviceMacAddress,
                       "SN":selectedDevice.deviceId,
                       //"Status":selectedDevice.lightStatus,
                       "gatewayMac":selectedDevice.gatewayName
                     }
           console.log(regData);      
           let regTopic = "HTS/"+selectedDevice.gatewayName+"/COMMAND/delete";

            /*  this.ajaxService.registration('mqttOnlineStatus', {}).subscribe(register =>{
                this.popupStatusMessage = "Command Sent "+register;
                document.getElementById("openModalButton").click();
                console.log(this.popupStatusMessage);
                if(register == 'Successful'){*/
                  this.ajaxService.registration('registration', {'regData':regData,'regTopic':regTopic}).subscribe(register =>{
                   
                      this.popupResponseMessage = register;
                      console.log(this.popupResponseMessage);
                      document.getElementById("openModalResponseButton").click();
                      
                   })
                /*}
              })*/
             }

            this.popupStatusMessage = "Device Deleted "+data.statusMessage;
            document.getElementById("openModalButton").click();
            this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"site_details"}).subscribe(sitesDetails => {
              this.sitesDetails = sitesDetails;
              this.sitesDetails.sort();
            });
             this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"siteName":this.selectedSiteName},"collection":"gateway_details"}).subscribe(gateway_details => {
              this.thisSitsGateways = gateway_details;
              this.thisSitsGateways.sort();
              /*this.thisSitsGateways = [];
              let flags = [], l = site_details.length, i;
              for( i=0; i<l; i++) {
                  if( flags[site_details[i].gatewayName]) continue;
                  flags[site_details[i].gatewayName] = true;
                  this.thisSitsGateways.push(site_details[i]);
                  this.thisSitsGateways.sort();
              }*/
            });
            this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"siteName": this.selectedSiteName,"gatewayName": this.selectedGatewayName},"collection":"device_details"}).subscribe(live_data => {
              this.thisSitsDevices = [];
              this.thisSitsDevices = live_data;
              this.thisSitsDevices.sort();
            });
          });
      }
}

