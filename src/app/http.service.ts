/**
 * Created by th3ee on 1/18/18.
 */
import { HttpClient, HttpResponse, HttpHeaders, HttpParams,  } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import * as moment from 'moment';


export class Record {
  constructor(
    public Complete_by: string,
    public Name: string,
    public No: string,
    public Province: string,
    public Status: string,
    public Updated_time: string
  ) {}
}
@Injectable()
export class HttpService {

  baseUrl = 'http://59.110.52.133:9504';

  constructor(
    private http: HttpClient,
    private injector: Injector
  ) {}

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error); // ?
  }

  getParams(params: any): any {
    return 'q=' + JSON.stringify(params);
  }

  getDiagnosis(name: string): Observable<any> {
    return this.http.get(this.baseUrl + '/cancer/classification/?q=' + JSON.stringify({
        'name': name
      })).do(res => console.log(res));
  }

  getPng(name: string, slice: string): Observable<Blob> {
    console.log('get image');
    return this.http.get(this.baseUrl + '/cancer/fileop/?q=' + JSON.stringify({
        'name': name,
        'slice': slice
      }), {responseType: 'blob'}).do(res => {
        console.log('get it');
        console.log(res);
    });
  }
  getList(name: string): Observable<any> {
    return this.http.get(this.baseUrl + '/cancer/slicelist/?q=' + JSON.stringify({
        'name': name
      })).do(res => console.log(res));
  }
  getClassification(name: string): Observable<any> {
    return this.http.get(this.baseUrl + '/cancer/classification/?q=' + JSON.stringify({
        'name': name
      })).do(res => console.log(res));
  }
  getPatientList(): Observable<any> {
    return this.http.get(this.baseUrl + '/cancer/patientlist/').do(res => console.log(res));
  }
}
