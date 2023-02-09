import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";
import { StorageService } from "../services/storage.service";


@Injectable({
    providedIn: 'root'
})

export class UserRouteGuard implements CanActivate {

    constructor(private router:Router,private localStorage: StorageService, private auth:AuthenticationService ){
    }

    canActivate(route:ActivatedRouteSnapshot,state: RouterStateSnapshot):Observable<boolean | UrlTree> | boolean{
        let data = this.localStorage?.getUserData()
        if(data != null){
            console.log("UserAuthGuardService called and return true = " + this.auth.IsAuthenicated())
            return true
        }
        else{
            console.log("UserAuthGuardService called and return false = " + this.auth.IsAuthenicated())
            this.router.navigate(['login'])
            return false
        }
    }
}