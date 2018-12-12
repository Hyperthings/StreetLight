import {Component,OnInit} from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {VariablesService} from './shared/services/variables.service';
import {Router, RouterModule} from '@angular/router';

@Component({
    selector: 'my-app',
    templateUrl: './assets/src/app/app.component.html'
})

export class AppComponent {
	currentUser: string;
	public varService:VariablesService;
	constructor(private variablesService:VariablesService, private router: Router){

		 
		this.varService=variablesService;
	}

	ngOnInit(){
		this.currentUser = localStorage.getItem('currentUser');
		 if(Cookie.get("isLoggedin")=="true"){
		 	
            this.variablesService.login=true;
            /*this.router.navigateByUrl("/projects");*/
        }else{
            this.router.navigateByUrl("/login");
        }
	}

	logout(){
		Cookie.get("isLoggedin")=="false"
		 this.router.navigateByUrl("/login");
	}
		
	
}
