import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment, environment2 } from "src/environments/environment";


@Injectable({
    providedIn:'any'
})

export class HttpService { 

    url: string = environment.apiEndPoint;
    ACTCUrl:string = environment2.apiEndPoint

    constructor(public http: HttpClient) {}
    get(endpoint: string, params?: any, reqOpts?: any) {
      if (!reqOpts) {
        reqOpts = {
          params: new HttpParams(),
        };
      }
  
      // Support easy query params for GET requests
      if (params) {
        reqOpts.params = new HttpParams();
        for (let k in params) {
          reqOpts.params.set(k, params[k]);
        }
      }
  
      return this.http
        .get(this.url  + endpoint, reqOpts)
        .pipe(map((response) => response));
    }

    getACTC(endpoint: string, params?: any, reqOpts?: any):any{
      if (!reqOpts) {
        reqOpts = {
          params: new HttpParams(),
        };
      }
  
      // Support easy query params for GET requests
      if (params) {
        reqOpts.params = new HttpParams();
        for (let k in params) {
          reqOpts.params.set(k, params[k]);
        }
      }
      
      return this.http
        .get(this.ACTCUrl + endpoint, reqOpts)
        .pipe(map((response) => response));
    }

    postACTC(endpoint: string, body: any, reqOpts?: any){
      return this.http.post(this.ACTCUrl + endpoint, body, reqOpts);
    }
  
    post(endpoint: string, body: any, reqOpts?: any) {
      return this.http.post(this.url + endpoint, body, reqOpts);
    }
  
    put(endpoint: string, body?: any, reqOpts?: any) {
      return this.http.put(this.url + endpoint, body, reqOpts);
    }
  
    delete(endpoint: string, reqOpts?: any) {
      return this.http.delete(this.url + endpoint, reqOpts);
    }
  
    patch(endpoint: string, body: any, reqOpts?: any) {
      return this.http.put(this.url  + endpoint, body, reqOpts);
    }
    getFile(endPoint: string): Observable<any> {
      return this.http.get(this.url  + endPoint, {
        responseType: "blob",
        observe: "response",
      });
    }
    getFilePost(endPoint: string, body?: any): Observable<any> {
      return this.http.post(this.url + endPoint, body, {
        responseType: "blob",
        observe: "response",
      });
    }
}