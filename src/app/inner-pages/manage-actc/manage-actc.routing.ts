import { ReleaseMomComponent } from './release-mom/release-mom.component';
import { ManageActcCategoriesComponent } from './manage-actc-categories/manage-actc-categories.component';
import { RouterModule } from '@angular/router';
import { ManageActcComponent } from './manage-actc.component';
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { ActcListComponent } from './manage-actc-list/manage-actc-list.component';


const manageActcRoute:Routes = [
    { path:'', component: ManageActcComponent, children:[
        { path:'',redirectTo:"list", pathMatch:"full" },
        { path:'list',component: ActcListComponent},
        // { path:'categories',loadChildren: () => import("./manage-actc-categories/manage-actc-categories.module").then(x => x.ManageActcCategoriesModule)},
        { path:'categories',component:ManageActcCategoriesComponent},
        { path:'release-mom',component: ReleaseMomComponent},
    ]}
]

@NgModule({
    imports:[RouterModule.forChild(manageActcRoute)],
    exports:[RouterModule]
})

export class ManageActcRoutingModule{

}