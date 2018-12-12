import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import {AjaxService} from './../shared/services/ajax.service';
import {VariablesService} from './../shared/services/variables.service';
declare var NProgress: any;
declare var $: any;

@Component({
	selector: 'overview',
	templateUrl: './assets/src/app/user-overview/user-overview.component.html'
})


export class UserOverviewComponent implements OnInit{
	
	public usereDetails: any;
	public roles:any;
	public selectedUserDetails: any/* Object[] = []*/;
	role:"";
	
	constructor( private _router: Router, private variablesService : VariablesService, private ajaxService: AjaxService, ){
		NProgress.start();
		this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"users"}).subscribe(usereDetails => {

			console.log(usereDetails);
			this.usereDetails = usereDetails;


		});
		NProgress.done();
	}

	ngOnInit(){

		this.roles = ["Super Admin", "Admin", "User"];
	}


	addRole(usereDetail:any){
		this.selectedUserDetails = usereDetail;
		$('#myModal').modal('show');
		console.log("this.selectedUser",this.selectedUserDetails);
	}

	selectedRole(role:any){
		//alert("test");
		console.log("role",role);
		this.role = role;
	}

	saveAssignedRole(){
		this.selectedUserDetails.role = this.role;
		console.log("this.selectedUserDetails.role",this.selectedUserDetails);
		this.ajaxService.saveObject(this.selectedUserDetails,'users').subscribe(obj => {
                  if(obj){
                    //this._router.navigate(['user']);
                  }else{
                    console.log("Data Not Updated")
                  }
            });

		/*var obj = {
            collection: 'users',
            data: this.selectedUserDetails
        }

        console.log("data:+++",obj);
        var url = '/api/updateObject/'+ obj.data._id;
        delete obj.data._id;*/

       /* this.apiService.updateObject(obj,url)
            .subscribe(obj => {
                  if(obj){
                    //this._router.navigate(['user']);
                  }else{
                    console.log("Data Not Updated")
                  }
            });
*/
	}


}