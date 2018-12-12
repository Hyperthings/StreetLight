import {Component, 
    OnInit,
    trigger,
    state,
    style,
    transition,
    animate,
    keyframes} from '@angular/core';
import {AjaxService} from './../shared/services/ajax.service';
import {Router, RouterModule} from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {VariablesService} from './../shared/services/variables.service';


@Component({
    selector: 'login-component',
    templateUrl: './assets/src/app/login/login.component.html',
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

export class LoginComponent implements OnInit  {


	public credentials:any;
    public isLoggedin: boolean;
    public showInvalidAlert: boolean;
	 
	constructor(private ajaxService: AjaxService, private router: Router, private variablesService:VariablesService){
        
	}


	    ngOnInit() {
          
    	this.credentials ={
    		username:'',
    		password:''
    	}
    }

    login(model: any, isValid: boolean) {
        
    	if(model.username=="htsuser" && model.password=="hts@123" || model.username == "demo" && model.password == "demo"){
            this.variablesService.login=true;
            localStorage.setItem('currentUser',model.username);
            Cookie.set("isLoggedin","true", 1) //expires login in 30 minutes
            this.router.navigateByUrl("/home");
    	}else if(model.username=="csuser" && model.password=="csuser@123"){

            this.variablesService.login=true;
            Cookie.set("isLoggedin","true", 1) //expires login in 30 minutes
            this.router.navigateByUrl("/home");
        }else{
            this.showInvalidAlert = true;
            setTimeout(()=>{   
                  this.showInvalidAlert = false;
             },5000);
        }

    }

    
}
