import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import { Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AjaxService {
    private _baseUrl = "http://localhost:4000/";

    constructor(private http: Http) { }

    getObject(url: any) {

		 return this.http.get(url)
                        // ...and calling .json() on the response to return data
                         .map((res:Response) => res.json())
                         //...errors if any
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

    }


    fetchSelectedObjects (url: any,data: any) {

    	let body = JSON.stringify({ data });
	    let headers = new Headers({ 'Content-Type': 'application/json' });
	    let options = new RequestOptions({ headers: headers });

	    return this.http.post(url, body, options)
	                    .map((res:Response) => res.json())
	                         //...errors if any
	                         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  	}



    /*saveObject(model:any, type:String) {
    	let saveUrl= 'saveObject/' + type
		let body = JSON.stringify(model);
		//let headers = new Headers({ 'Content-Type': 'application/json' });
		//let options = new RequestOptions({ headers: headers });
		console.log(saveUrl)
		console.log(model)
		return this.http.post(saveUrl, model).subscribe(data => {
                console.log(data);
          }, error => {
              console.log(JSON.stringify(error.json()));
          });
			//.map(this.extractData)
			//.catch(this.handleError);
			

	}*/


	saveObject(model:any, type:String) {
    	let saveUrl= 'saveObject/' + type
		let body = JSON.stringify(model);
		/*let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });*/
		console.log(saveUrl)
		console.log(model)
		return this.http.post(saveUrl, model).map(res => res.json());
			

	}



	private extractData(res: Response) {
		let body = res.json();
		console.log("DATA",body)
		return body.data || {};
	}

	private handleError(error: any) {
		// In a real world app, we might use a remote logging infrastructure
		// We'd also dig deeper into the error to get a better message
		let errMsg = (error.message) ? error.message :
			error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		console.error(errMsg); // log to console instead
		return Observable.throw(errMsg);
	}


	fileUpload (data: any) {
	    JSON.stringify(data[0].name)
	    console.log('file',JSON.stringify(data[0].name))
	    return this.http.post('fileUpload', data)
	                    .map((res:Response) => res.json())
	                         //...errors if any
	                         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  	}

  	registration (url: any,data: any) {

    	let body = JSON.stringify({ data });
	    let headers = new Headers({ 'Content-Type': 'application/json' });
	    let options = new RequestOptions({ headers: headers });

	    return this.http.post(url, body, options)
	                    .map((res:Response) => res.json())
	                         //...errors if any
	                         .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  	}



}