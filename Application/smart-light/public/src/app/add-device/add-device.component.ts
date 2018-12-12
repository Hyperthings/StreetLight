import {  Component, 
          OnInit,
          trigger,
          state,
          style,
          transition,
          animate,
          keyframes } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import * as XLSX from 'xlsx';
import {AjaxService} from './../shared/services/ajax.service';
import {VariablesService} from './../shared/services/variables.service';
declare var NProgress: any;
declare var $: any;


@Component({
	selector: 'add-device', 
	providers: [AjaxService],
	templateUrl: './assets/src/app/add-device/add-device.component.html',
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


export class AddDeviceComponent {
	
	public deviceDetails: any;
	device: FormGroup;
  gateway: FormGroup;
	public password : any;
  public confirm : any;
 	public passwordAlert : boolean = true;
  isThisGateway: boolean = true;
  siteName: string;
  gatewayName: string;
  gatewayId: string;
  allSites: any;
  allGateways: any;
  importedDevices: any;
  devicesForAddToSite: any[] = [];
  selctedDiviceForEdit:any;
  selctedGatewayForEdit:any;
  popupStatusMessage: string;
  popupResponseMessage: any ={};
  addOrUpdate: string = 'Add';
  hideButtons: boolean = true;
  sitesDetails: any;
  showDeviceIdAvailableError: boolean = false;
  showGatewayMacAvailableError: boolean = false;
  showDeviceNameAvailableError: boolean = false;
  showInvalidAlert: boolean = false;
  hideDefaultInputs: boolean = true;
  showDeviceMACAvailableError: boolean = false;

  constructor(private ajaxService: AjaxService, private variablesService:VariablesService, private _router:Router, 
              private route: ActivatedRoute, private _location: Location){

  
   /* this.ajaxService.fetchSelectedObjects('getDistinctObjects',{"query": "site","collection":"site_details"}).subscribe(allSites => {
      this.allSites = allSites;
      this.allSites.sort();
    });*/
    
  }

    ngOnInit() {
      NProgress.start();
      //this.siteName = this.route.snapshot.params.id;
      this.siteName = this.variablesService.selctedSiteName;

      this.ajaxService.fetchSelectedObjects('getObjects',{"query": {'siteName':this.siteName},"collection":"site_details"}).subscribe(sitesDetails => {
      this.sitesDetails = sitesDetails[0];
    });


     /* console.log('Add Gateway :',this.variablesService.addGateway 
                  +'Edit Gateway :',this.variablesService.editGateway
                  +" Add Device : ",this.variablesService.addDevice
                  +" Edit Device : ",this.variablesService.editDevice
                  )*/

       /* this.variablesService.editGateway = false;
        this.variablesService.addGateway = false;
        this.variablesService.addDevice = false;
        this.variablesService.editDevice = true;*/

        this.gateway = new FormGroup({
          gatewayName: new FormControl('', [Validators.required, Validators.minLength(2)]),
          siteName: new FormControl(this.siteName, Validators.required),
          //macAddress: new FormControl('', Validators.required),
          gatewayId: new FormControl('', Validators.required),
          latitude: new FormControl('', Validators.required),
          longitude: new FormControl('', Validators.required)
        });
        this.gatewayName = this.gateway.controls['gatewayName'].value

        if (this.variablesService.addGateway == true) { 
          this.gateway = new FormGroup({
            gatewayName: new FormControl('', [Validators.required, Validators.minLength(2)]),
            siteName: new FormControl(this.siteName, Validators.required),
            //macAddress: new FormControl('', Validators.required),
            gatewayId: new FormControl('', Validators.required),
            latitude: new FormControl('', Validators.required),
            longitude: new FormControl('', Validators.required)
          });
          this.siteName = this.gateway.controls['siteName'].value;
        }else if ( this.variablesService.addDevice == true) {
          this.isThisGateway = false; 
          let selctedSiteGateway = JSON.parse(localStorage.getItem('selctedSiteGateway'));
          console.log('selctedSiteGateway',selctedSiteGateway)
          this.siteName = selctedSiteGateway.selectedSite;
          this.gatewayName = selctedSiteGateway.selectedGateway;
          this.gatewayId = selctedSiteGateway.selectedGatewayId;
          this.isThisGateway = false;
          this.addOrUpdate = 'Add'
          this.device = new FormGroup({
            siteName: new FormControl(this.siteName, Validators.required),
            deviceName: new FormControl('', Validators.required),
            gatewayName: new FormControl(this.gatewayName, Validators.required),
            gatewayId: new FormControl(this.gatewayId, Validators.required),
            deviceId: new FormControl('', Validators.required),
            deviceMacAddress: new FormControl('', Validators.required),
            longitude: new FormControl('', Validators.required),
            latitude: new FormControl('', Validators.required),
          });
        }else if (this.variablesService.editGateway == true) {
          this.variablesService.selctedSiteGateway = false;
          this.selctedGatewayForEdit = JSON.parse(localStorage.getItem('selctedGateway'));
          console.log(this.selctedGatewayForEdit);
          this.isThisGateway = true;
          this.addOrUpdate = 'Update';
          this.siteName = this.selctedGatewayForEdit.siteName;

          this.gateway = new FormGroup({
              siteName: new FormControl(this.selctedGatewayForEdit.siteName, Validators.required),
              gatewayName: new FormControl(this.selctedGatewayForEdit.gatewayName, Validators.required),
              gatewayId: new FormControl(this.selctedGatewayForEdit.gatewayId, Validators.required),
              //macAddress: new FormControl(this.selctedGatewayForEdit.macAddress, Validators.required),
              longitude: new FormControl(this.selctedGatewayForEdit.longitude, Validators.required),
              latitude: new FormControl(this.selctedGatewayForEdit.latitude, Validators.required)
          });
        }else if (this.variablesService.editDevice == true) {
          this.selctedDiviceForEdit = JSON.parse(localStorage.getItem('selctedDivices'));
          console.log(this.selctedDiviceForEdit);
          this.isThisGateway = false;
          this.addOrUpdate = 'Update';
          this.hideButtons = false;

          this.device = new FormGroup({
              siteName: new FormControl(this.selctedDiviceForEdit.siteName, Validators.required),
              deviceName: new FormControl(this.selctedDiviceForEdit.deviceName, Validators.required),
              gatewayName: new FormControl(this.selctedDiviceForEdit.gatewayName, Validators.required),
              gatewayId: new FormControl(this.selctedDiviceForEdit.gatewayId, Validators.required),
              deviceId: new FormControl(this.selctedDiviceForEdit.deviceId, Validators.required),
              deviceMacAddress: new FormControl(this.selctedDiviceForEdit.deviceMacAddress, Validators.required),
              longitude: new FormControl(this.selctedDiviceForEdit.longitude, Validators.required),
              latitude: new FormControl(this.selctedDiviceForEdit.latitude, Validators.required)
          });
        }

    NProgress.done();
  }

  selectTyppe(){
    this.isThisGateway = !this.isThisGateway
    this.isThisGateway == true ? 'Gateway' : 'Device';
    this.importedDevices = false;
    this.variablesService.isFromGateway = true;
    this.addOrUpdate = 'Add'
    this.siteName = this.gateway.controls['siteName'].value;
    this.gatewayName = this.gateway.controls['gatewayName'].value;
    this.gatewayId = this.gateway.controls['gatewayId'].value;
    this.device = new FormGroup({
        siteName: new FormControl(this.siteName, Validators.required),
        deviceName: new FormControl('', Validators.required),
        gatewayName: new FormControl(this.gatewayName, Validators.required),
        gatewayId: new FormControl(this.gatewayId, Validators.required),
        deviceId: new FormControl('', Validators.required),
        deviceMacAddress: new FormControl('', Validators.required),
        longitude: new FormControl('', Validators.required),
        latitude: new FormControl('', Validators.required),
        //longitude: new FormControl('', Validators.required)
      
    });
    this.gateway = new FormGroup({
        gatewayName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        siteName: new FormControl(this.siteName, Validators.required),
        //macAddress: new FormControl('', Validators.required),
        gatewayId: new FormControl('', Validators.required),
        latitude: new FormControl('', Validators.required),
        longitude: new FormControl('', Validators.required)
      });
  }


  //Excel to JSON
  fileChangeEvent(evt: any){
    this.importedDevices = [];
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.devicesForAddToSite = XLSX.utils.sheet_to_json(ws);

      console.log('devicesForAddToSite',Object(this.devicesForAddToSite));
      console.log('devicesForAddToSite', typeof this.devicesForAddToSite[0].deviceid);

      if(!this.devicesForAddToSite[0].deviceId ||
          !this.devicesForAddToSite[0].deviceName ||
          !this.devicesForAddToSite[0].gatewayName ||
          !this.devicesForAddToSite[0].gatewayId||
          !this.devicesForAddToSite[0].latitude ||
          !this.devicesForAddToSite[0].longitude ||
          !this.devicesForAddToSite[0].deviceMacAddress ||
          !this.devicesForAddToSite[0].siteName 
        ){
        this.devicesForAddToSite = undefined;
        this.popupStatusMessage = "Please select valid file";
        document.getElementById("openModalButton").click();
      }

      console.log('hhh',this.devicesForAddToSite);
    };
    reader.readAsBinaryString(target.files[0]);
    }

 addToSite(device:any){
   console.log(this.device.valid)
   //console.log('device',device);
   if(this.device.valid){
      device.address = this.sitesDetails.address;
      device.solution = this.sitesDetails.solution;
      this.devicesForAddToSite.push(device);
      device = {};

      this.device = new FormGroup({
          siteName: new FormControl(this.siteName, Validators.required),
          deviceName: new FormControl('', Validators.required),
          gatewayName: new FormControl(this.gatewayName, Validators.required),
          gatewayId: new FormControl(this.gatewayId, Validators.required),
          deviceId: new FormControl('', Validators.required),
          deviceMacAddress: new FormControl('', Validators.required),
          longitude: new FormControl('', Validators.required),
          latitude: new FormControl('', Validators.required),
          //longitude: new FormControl('', Validators.required)
        
      });
    }else {
      this.showInvalidAlert = true;
      let that = this;
      setTimeout(function(){
        that.showInvalidAlert = false;
      },5000);
    }
   
  }




  onSubmit(value:any, event:any) {
    event.preventDefault();

        let that = this;
    let deviceRegistration = false;
    let data = value['_value'];
    let collectionName: string;
     if(this.variablesService.isFromGateway == false){
       data = this.devicesForAddToSite[0];
       data._id = this.selctedDiviceForEdit._id;
       data.address = this.selctedDiviceForEdit.address;
       data.solution = this.selctedDiviceForEdit.solution;
      collectionName = 'device_details';
      saveOrUpdateObject();
     } else if(this.variablesService.editGateway == true){
       data._id = this.selctedGatewayForEdit._id;
       data.address = this.selctedGatewayForEdit.address;
       data.solution = this.selctedGatewayForEdit.solution;
      collectionName = 'gateway_details';
      saveOrUpdateObject();
     }else if(this.isThisGateway == true){
       if(this.gateway.valid){
         //data._id = this.gateway.controls['gatewayName'].value;
         data.address = this.sitesDetails.address;
         data.solution = this.sitesDetails.solution;
          collectionName = 'gateway_details';
          console.log(data);
          saveOrUpdateObject();
          
          this.gateway = new FormGroup({
            gatewayName: new FormControl('', [Validators.required, Validators.minLength(2)]),
            siteName: new FormControl(this.siteName, Validators.required),
            //macAddress: new FormControl('', Validators.required),
            gatewayId: new FormControl('', Validators.required),
            latitude: new FormControl('', Validators.required),
            longitude: new FormControl('', Validators.required)
          });
       } else {
        this.showInvalidAlert = true;
        setTimeout(function(){
          that.showInvalidAlert = false;
        },5000);
      }
    }else {
      data = this.devicesForAddToSite;
      collectionName = 'device_details';
      deviceRegistration = true;
      saveOrUpdateObject();
    }
    function saveOrUpdateObject(){
      that.ajaxService.saveObject(data,collectionName).subscribe(device_details => {
        if(deviceRegistration != true){
          that.popupStatusMessage = collectionName == 'device_details' ? 'Device ' : 'Gateway '
          that.popupStatusMessage += device_details.message;
          console.log("_details",device_details.message);
          document.getElementById("openModalButton").click();
        }
     });
    }
    

    if(deviceRegistration == true){
        this.popupStatusMessage = "Command Sent Successfully";
        document.getElementById("openModalButton").click();
       
        let i = 0;
        let deviceArray: any[] = [];



        this.ajaxService.fetchSelectedObjects('getObjects',{"query": {'gatewayName':data[0].gatewayName},"collection":"device_details"}).subscribe(device_details => {
          //this.sitesDetails = device_details;
          for(let device of device_details) {
            this.devicesForAddToSite.push(device)
          }  
            console.log('All Devices : ',this.devicesForAddToSite);
            var deviceData="{\"CommandID\":"+Math.floor(100000000 + Math.random() * 900000000)+",\"Command\":\"DeviceList\",\"gatewayMac\":\""+data[0].gatewayName+"\"";


             for(let device of this.devicesForAddToSite) {
               i++;
               deviceData += ",\"Device" +i+ "\":{\"MacAddress\":\""+device.deviceMacAddress+"\",\"SN\":\""+device.deviceId+"\"}";
             }
             deviceData += "}";
      
            let regData = JSON.parse(deviceData)

           let regTopic = "HTS/"+data[0].gatewayName+"/COMMAND/DeviceList";
           $.blockUI(this.cssObjectForblockUI());
           this.ajaxService.registration('registration', {'regData':regData,'regTopic':regTopic}).subscribe(register =>{
            /*this.popupStatusMessage = "Command executed "+register;
            document.getElementById("openModalButton").click();*/
             $.unblockUI(); 
              this.popupResponseMessage = register;
              document.getElementById("openModalResponseButton").click();
           })
            this.devicesForAddToSite = [];

            });

     

      }

    //this._router.navigate(['/device']);

    this.device = new FormGroup({
        siteName: new FormControl(this.siteName, Validators.required),
        deviceName: new FormControl('', Validators.required),
        gatewayName: new FormControl(this.gatewayName, Validators.required),
        gatewayId: new FormControl(this.gatewayId, Validators.required),
        deviceId: new FormControl('', Validators.required),
        deviceMacAddress: new FormControl('', Validators.required),
        longitude: new FormControl('', Validators.required),
        latitude: new FormControl('', Validators.required),
        //longitude: new FormControl('', Validators.required)
      
    });
    //this.isThisGateway = !this.isThisGateway
 
  }

 

  addImportedDevices(){
    let i = 0;
     let deviceArray: any[] = [];
    for(let importedDevice of this.devicesForAddToSite){
      i  += 1;
      let deviceName = 'device'+1
      deviceArray.push(
        {deviceName:{
             "MacAddress":importedDevice.macaddress,
              "SN":importedDevice.deviceid
          }}
        )
    }
    console.log(deviceArray)
     let regData = { "CommandID": new Date().getTime(), //Unix format as a Unique id
                       "Command":"DeviceList", 
                       "devices":deviceArray,
                       "gatewayMac":'HTS-GT1'
                     }

       let regTopic = "HTS/HTS-GT1/COMMAND/DeviceList"; 
           $.blockUI(this.cssObjectForblockUI());
        this.ajaxService.registration('mqttOnlineStatus', {}).subscribe(register =>{
              this.popupStatusMessage = "Command Sent "+register;
              document.getElementById("openModalButton").click();

          if(register == 'Successful'){
           this.ajaxService.registration('registration', {'regData':regData,'regTopic':regTopic}).subscribe(register =>{
            /*this.popupStatusMessage = "Command Sent "+register;
            document.getElementById("openModalButton").click();*/
              $.unblockUI();
              this.popupResponseMessage = register;
              console.log('popupResponseMessage', this.popupResponseMessage)
               document.getElementById("openModalResponseButton").click();
           })
         }else{
           $.unblockUI();
         }
       })
    /*this.ajaxService.saveObject(this.importedDevices,'device_details').subscribe(device_details => {
     
   });*/
  }



  checkdeviceIdAvailability(event: any){
    this.showDeviceIdAvailableError = false;
    let existingDeviceIdCount = 0;
    if(this.devicesForAddToSite.length > 0){
      for(let device of this.devicesForAddToSite){
        if(device.deviceId == event.target.value){
          existingDeviceIdCount += 1;
        }
      }
      if(existingDeviceIdCount > 0){
        this.showDeviceIdAvailableError = true;
      }else if(existingDeviceIdCount <= 0){
        this.showDeviceIdAvailableError = false;
      }
    }
    if(this.showDeviceIdAvailableError == false){
      let deviceId: string;
      deviceId = event.target.value;
      this.ajaxService.fetchSelectedObjects('getObjects',{"query": {'deviceId':deviceId},"collection":"device_details"}).subscribe(device_details => {
        
        console.log('device_details', device_details);
        if(device_details.length > 0){
          this.showDeviceIdAvailableError = true;
        }else if(device_details.length <= 0){
          this.showDeviceIdAvailableError = false;
        }
      });
    }
    console.log(this.showDeviceIdAvailableError);
  }

  checkGatwayMacAvailability(event: any){

    let gatewayName: string;
    gatewayName = event.target.value;
    this.ajaxService.fetchSelectedObjects('getObjects',{"query": {'gatewayName':gatewayName},"collection":"gateway_details"}).subscribe(gateway_details => {
      
      console.log('gateway_details', gateway_details);
      if(gateway_details.length > 0){
        this.showGatewayMacAvailableError = true;
      }else if(gateway_details.length <= 0){
        this.showGatewayMacAvailableError = false;
      }
    });
    if(this.showGatewayMacAvailableError == false){
       this.ajaxService.fetchSelectedObjects('getObjects',{"query": {'deviceMacAddress':gatewayName},"collection":"device_details"}).subscribe(device_details => {
        
        console.log('device_details', device_details);
        if(device_details.length > 0){
          this.showGatewayMacAvailableError = true;
        }else if(device_details.length <= 0){
          this.showGatewayMacAvailableError = false;
        }
      });
    }
  }

  checkDeviceNameAvailability(event: any){
    this.showDeviceNameAvailableError = false;
    let existingDeviceNameCount = 0;
    if(this.devicesForAddToSite.length > 0){
      for(let device of this.devicesForAddToSite){
        if(device.deviceName == event.target.value){
          existingDeviceNameCount += 1;
        }
      }
      if(existingDeviceNameCount > 0){
        this.showDeviceNameAvailableError = true;
      }else if(existingDeviceNameCount <= 0){
        this.showDeviceNameAvailableError = false;
      }
    }
    if(this.showDeviceNameAvailableError == false){
      let deviceName: string;
      deviceName = event.target.value;
      this.ajaxService.fetchSelectedObjects('getObjects',{"query": {'deviceName':deviceName},"collection":"device_details"}).subscribe(device_details => {
        
        console.log('device_details', device_details);
        if(device_details.length > 0){
          this.showDeviceNameAvailableError = true;
        }else if(device_details.length <= 0){
          this.showDeviceNameAvailableError = false;
        }
      });
    }
  }

  checkdeviceMacAvailability(event: any){
      let deviceMac: string;
      deviceMac = event.target.value;

    this.showDeviceMACAvailableError = false;
    let existingDeviceMacCount = 0;
    if(this.devicesForAddToSite.length > 0){
      for(let device of this.devicesForAddToSite){
        if(device.deviceName == event.target.value){
          existingDeviceMacCount += 1;
        }
      }
      if(existingDeviceMacCount > 0){
        this.showDeviceMACAvailableError = true;
      }else if(existingDeviceMacCount <= 0){
        this.showDeviceMACAvailableError = false;
      }
    }
    if(this.showDeviceMACAvailableError == false){
      this.ajaxService.fetchSelectedObjects('getObjects',{"query": {'deviceMacAddress':deviceMac},"collection":"device_details"}).subscribe(device_details => {
        
        console.log('device_details', device_details);
        if(device_details.length > 0){
          this.showDeviceMACAvailableError = true;
        }else if(device_details.length <= 0){
          this.showDeviceMACAvailableError = false;
        }
      });
    }
    if(this.showDeviceMACAvailableError == false){
      this.ajaxService.fetchSelectedObjects('getObjects',{"query": {'gatewayName':deviceMac},"collection":"gateway_details"}).subscribe(device_details => {
        
        console.log('device_details', device_details);
        if(device_details.length > 0){
          this.showDeviceMACAvailableError = true;
        }else if(device_details.length <= 0){
          this.showDeviceMACAvailableError = false;
        }
      });
    }
  }

  cssObjectForblockUI(){
    return { 
      css: { 
        border: 'none', 
        padding: '15px', 
        backgroundColor: '#000', 
        '-webkit-border-radius': '10px', 
        '-moz-border-radius': '10px', 
        opacity: .5, 
        color: '#fff' 
      } 
    }
  }

}