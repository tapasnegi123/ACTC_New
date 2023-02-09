import { NgModule } from "@angular/core";
import { LoginComponent, HomeComponent, ContactUsComponent } from "./outer-pages.barrel";
import { Routes, RouterModule } from "@angular/router";
import { OuterPagesComponent } from "./outer-pages.component";
import { ApprovedActcComponent } from "./approved-actc/approved-actc.component";
import { LoginWithOtpComponent } from "./login-with-otp/login-with-otp.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";


const outerRoutes: Routes = [
    {
        path: '', component: OuterPagesComponent,
        children: [
            { path: "", redirectTo: "/home", pathMatch:"full" },
            { path: "home", loadChildren: () => import("./home/home.module").then(res => res.HomeModule), title:"ACTC - home" },
            { path: "login", component: LoginComponent ,title:"ACTC - login"},
            { path: "contact-us", component: ContactUsComponent , title:"ACTC - contact"},
            { path: "approved-actc", component: ApprovedActcComponent , title:"ACTC - approved"},
            { path: "login-with-otp", component: LoginWithOtpComponent, title: "ACTC - login with otp"},
            { path: "forgot-password", component: ForgotPasswordComponent,title: "ACTC - forgot password" },
            { path: "reset-password", component: ResetPasswordComponent,title: "ACTC - reset password" }
        ]
    }

]

@NgModule({
    declarations: [],
    exports: [RouterModule],
    imports: [RouterModule.forChild(outerRoutes)]
})

export class OuterPagesRoutingModule {

}