import {Component, OnInit} from '@angular/core';
import {AjaxService} from './../shared/services/ajax.service';
import {VariablesService} from './../shared/services/variables.service';
declare var c3: any;
declare var d3pie: any;
declare var $: any;


@Component({
    selector: 'energy-index',
    templateUrl: './assets/src/app/wastemanagement/wastemanagement.component.html'
})

export class WasteManagementComponent implements OnInit  {

	
public waste_management: any[];
public lightControls: any[];
	
	constructor(private ajaxService: AjaxService, private variablesService:VariablesService){//"date":""

		this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"light_controls"}).subscribe(light_controls => {

			this.lightControls = light_controls;
			console.log(this.lightControls)

		});

		this.variablesService.selectedMenu ="Smart Waste";
		
	}
    ngOnInit() {
    	var rangeSlider = function(){
		  var slider = $('.range-slider'),
		      range = $('.range-slider-range'),
		      value = $('.range-slider-value');
		    
		  slider.each(function(){

		    value.each(function(){
		      var value = $(this).prev().attr('value');
		      $(this).html(value);
		    });

		    range.on('input', function(){
		      $(this).next(value).html(this.value);
		    });
		  });
		};

		rangeSlider();

    }

    
}
