import {Component} from '@angular/core';
import {VariablesService} from './../shared/services/variables.service';

@Component({
    selector: 'bottomnav',
    templateUrl: './assets/src/app/bottomnav/bottomnav.component.html'
})

export class BottomnavComponent {
	constructor(private variablesService:VariablesService){
		
	}
}
