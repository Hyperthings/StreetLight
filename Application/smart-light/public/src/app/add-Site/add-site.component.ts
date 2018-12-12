import { Component, OnInit,trigger,
          state,
          style,
          transition,
          animate,
          keyframes  } from '@angular/core';
import {Router} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import {AjaxService} from './../shared/services/ajax.service';
import {VariablesService} from './../shared/services/variables.service';
declare var NProgress: any;


@Component({
	selector: 'add-device',
  providers: [AjaxService],
	templateUrl: './assets/src/app/add-site/add-site.component.html',
     animations: [
        trigger('movePanel', [
            transition('void => *', [
                animate(600, keyframes([
                    style({transform: 'translateX(25px)'}),
                    style({transform: 'translateX(-25px)'}),
                    style({transform: 'translateX(25px)'}),
                    style({transform: 'translateX(-25px)'}),
                    style({transform: 'translateX(25px)'}),
                    style({transform: 'translateX(0)'}),
                ]))
            ]),
            transition('* => void', [
                animate(1000, keyframes([
                    style({opacity: .8}),
                    style({opacity: .6}),
                    style({opacity: .4}),
                    style({opacity: .3}),
                    style({opacity: .2}),
                    style({opacity: .1}),
                ]))
            ])
        ])
    ]
})


export class AddSiteComponent {
	
		user: FormGroup;
	public message : string ="New User Added Successfully";
	public password : any;
  public confirm : any;
 	public passwordAlert : boolean = true;
   popupStatusMessage: string;
   showInvalidAlert : boolean = false;
   showSiteNameAvailableError: boolean = false;
   showSiteIdAvailableError: boolean = false;

    constructor(
         private variablesService : VariablesService, private _location: Location, private ajaxService:AjaxService, private _router:Router) {}

    ngOnInit() {
      NProgress.start();
    this.user = new FormGroup({
      siteName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      solution: new FormControl('EMS', Validators.required),
      //siteName: new FormControl('', Validators.required),
      siteId: new FormControl('', Validators.required),
      longitude: new FormControl('', Validators.required),
      latitude: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      
    });

    NProgress.done();
  }

 
  
  onSubmit(value:any) {
    let data = value['_value'];
    console.log(data);
    /*this.ajaxService.saveObject(data,'site_details').subscribe(site_details => {
      console.log("site_details",site_details)
   });*/
     if(this.user.valid){
       this.ajaxService.saveObject(data,'site_details').subscribe(device_details => {
          this.popupStatusMessage = 'Site '+device_details.message;
          console.log("_details",device_details.message);
          document.getElementById("openModalButton").click();
          this.user = new FormGroup({
            siteName: new FormControl('', [Validators.required, Validators.minLength(2)]),
            solution: new FormControl('EMS', Validators.required),
            //siteName: new FormControl('', Validators.required),
            siteId: new FormControl('', Validators.required),
            longitude: new FormControl('', Validators.required),
            latitude: new FormControl('', Validators.required),
            address: new FormControl('', Validators.required),
            
          });
       });
     }else {
       let that = this;
        this.showInvalidAlert = true;
        setTimeout(function(){
          that.showInvalidAlert = false;
        },5000);
      }
   
   
    //this._router.navigate(['/site']);
  }

  checkSiteNameAvailability(siteName: string){
    console.log(siteName)
    this.ajaxService.fetchSelectedObjects('getObjects',{"query": {'siteName':siteName},"collection":"site_details"}).subscribe(site_details => {
      
      console.log('site_details', site_details);
      if(site_details.length > 0){
        this.showSiteNameAvailableError = true;
      }else if(site_details.length <= 0){
        this.showSiteNameAvailableError = false;
      }
    });
  }

  checkSiteIdAvailability(siteId: string){
    console.log(siteId)
    this.ajaxService.fetchSelectedObjects('getObjects',{"query": {'siteId':siteId},"collection":"site_details"}).subscribe(site_details => {
      
      console.log('site_details', site_details);
      if(site_details.length > 0){
        this.showSiteIdAvailableError = true;
      }else if(site_details.length <= 0){
        this.showSiteIdAvailableError = false;
      }
    });
  }


}