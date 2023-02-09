import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AboutComponent } from "src/app/_common/components/about/about.component";
import { CarouselComponent } from "src/app/_common/components/carousel/carousel.component";
import { HomeComponent } from "./home.component";

const homeRoute:Routes = [
    { path:"",component:HomeComponent}
]

@NgModule({
    declarations:[
        HomeComponent,
        AboutComponent,
        CarouselComponent
    ],
    imports:[
        RouterModule.forChild(homeRoute)
    ],
    exports:[
    ]
})

export class HomeModule{

}