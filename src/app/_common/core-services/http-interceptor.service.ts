import { AlertService } from 'src/app/_common/services/alert.service';
import { HttpErrorResponse, HttpHandler, HttpHeaderResponse, HttpProgressEvent, HttpRequest, HttpResponse, HttpSentEvent, HttpUserEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, EMPTY, Observable, throwError } from "rxjs";
import { IUser } from "../interface/user.interface";
import { AuthenticationService } from "../services/authentication.service";
import { StorageService } from "../services/storage.service";

@Injectable({
  providedIn:'root'
})

export class HttpInterceptorService {

    constructor(private route: Router, private auth: AuthenticationService,private _storage:StorageService,
      private _alert:AlertService) {
    }
    

   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | 
   HttpHeaderResponse | HttpProgressEvent | 
   HttpResponse<any> | HttpUserEvent<any> | unknown | any> {
    // debugger
    // var userdata:any = JSON.parse(localStorage.getItem('loggedin_user')!) as IUser;
    var userdata = this._storage.getUserData()
    // console.log(userdata)
    
    if (userdata != null) {
      req = req.clone({
        setHeaders: {
          'Authorization':  `Bearer ${userdata.token}`
        }
      })
    }
    return next.handle(req).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 417) {
            this.handle417(err);
          }
          if(err.status === 401){
           this.handle401(err);
          }
          throw new Error(err.message)
        }
        return err
      })
    );
  }

  /** Error 417 : Invalid token */
  private handle417(error: HttpErrorResponse){
    this.auth.LogOut();
    this.route.navigateByUrl("/login");
    return EMPTY;
  }

 /** Error 401  */
 private handle401(error: HttpErrorResponse){
  //clear cache here
  this.route.navigateByUrl("/home");
  return EMPTY;
 }

 private handle500(error:HttpErrorResponse){
  this._alert.ShowWarning("Internal Server Error server",3000)
  this.route.navigate(['login'])
  return EMPTY
 }

 private handle404(error:HttpErrorResponse){
  // this._alert.ShowWarning("Error","")
 }
}