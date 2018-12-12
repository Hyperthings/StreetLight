import {Component} from '@angular/core';
import {VariablesService} from './../shared/services/variables.service';

@Component({
    selector: 'navbar',
    templateUrl: './assets/src/app/navbar/navbar.component.html'
})

export class NavbarComponent {

	constructor(private variablesService:VariablesService){
		
	}

	setNavbarState(state:string){

		this.variablesService.navbarState=state;
	}
}
