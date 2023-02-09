import { importProvidersFrom, NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { AnnonymousGuard } from "./_common/route-guards/annonymous-route.guard";
import { ErrorComponent } from "./_common/components/error/error.component";
import { UserRouteGuard } from "./_common/route-guards/user-route.guard";

const appRoutes:Routes = [
    { path: "" ,loadChildren: () => import("./outer-pages/outer-pages.module").then(event => event.OutterPagesModule), canActivate:[AnnonymousGuard] },
    { path: "" ,loadChildren: () => import("./inner-pages/inner-pages.module").then(event => event.InnerPagesModule), canActivate: [UserRouteGuard]},
    { path:"**", component: ErrorComponent  }
]

@NgModule({
    declarations:[ ],
    exports:[ RouterModule ],
    imports:[ RouterModule.forRoot(appRoutes,{
        preloadingStrategy:PreloadAllModules
    }) ]
})

export class AppRoutingModule{

}