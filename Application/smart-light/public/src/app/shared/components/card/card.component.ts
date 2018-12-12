import {Component, Input} from '@angular/core';

@Component({
    selector: 'card',
    templateUrl: './assets/src/app/shared/components/card/card.component.html'
})

export class CardComponent {

	@Input() title: String;
	@Input() class: String;
	constructor(){
		
	}
}
