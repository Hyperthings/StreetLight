import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import {AjaxService} from './../shared/services/ajax.service';
import {VariablesService} from './../shared/services/variables.service';
declare var NProgress: any;

@Component({
   // moduleId: module.id,
    selector: 'add-user',
    providers: [AjaxService],
    templateUrl: './assets/src/app/add-user/add-user.component.html'
})

export class AddUserComponent implements OnInit {
	user: FormGroup;
	public message : string ="New User Added Successfully";
	//public password : any;
  //public confirm : any;
 	public passwordAlert : boolean = true;



    constructor(
        private _router: Router, private variablesService : VariablesService, private _location: Location, private ajaxService: AjaxService ) {}

   ngOnInit() {
     NProgress.start();

    this.user = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', Validators.required),
      companyName: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      _id: new FormControl(''),
       password: new FormControl('', Validators.required),
       confirm: new FormControl('', Validators.required)
    });

    NProgress.done();
  }

  name = this.variablesService.name;
  email =  this.variablesService.email;
  password= this.variablesService.password;
  confirm = this.variablesService.confirm;
  companyName =  this.variablesService.companyName;
  _id= this.variablesService.id;
  hidePassword = this.variablesService.hidePassword;
  addOrUpdate = this.variablesService.addOrUpdate;
  
   passwordMatch(){
  	//console.log(this.password);
  	if(this.password !== this.confirm){

  		this.passwordAlert = false;
  	}
  	else{
  		this.passwordAlert = true;
  	}
  }
  
 onSubmit({ value, valid }: { value: User, valid: boolean }) {

   console.log(value);
    this.ajaxService.saveObject(value,'users');
    this._router.navigate(['/user']);
    
  }


}