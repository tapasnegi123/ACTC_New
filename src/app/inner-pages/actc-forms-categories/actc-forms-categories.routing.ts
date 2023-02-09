import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ActcFormCategoriesComponent } from "./actc-form-categories.component";

const categoriesRoute:Routes = [

    { path:'',component: ActcFormCategoriesComponent , children:[
        
    ]}
]
@NgModule({
    imports:[ RouterModule.forChild(categoriesRoute)],
    exports:[]
})

export class ActcFormCategoriesRoutingModule{
    
}