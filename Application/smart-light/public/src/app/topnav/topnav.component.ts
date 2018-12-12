import {Component} from '@angular/core';
import {VariablesService} from './../shared/services/variables.service';

@Component({
    selector: 'topnav',
    templateUrl: './assets/src/app/topnav/topnav.component.html'
})

export class TopnavComponent {
	constructor(private variablesService:VariablesService){
		
	}
}
