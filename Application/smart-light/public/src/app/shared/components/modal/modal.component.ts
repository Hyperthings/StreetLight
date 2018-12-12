import {Component, Input} from '@angular/core';

@Component({
    selector: 'modal',
    templateUrl: './assets/src/app/shared/components/modal/modal.component.html'
})

export class ModalComponent {

	@Input() title : string;
	@Input() class : string;
	@Input() name: string;
	@Input("trigger-button-class") triggerClass: string;
	
	constructor(){


		
	}
}
