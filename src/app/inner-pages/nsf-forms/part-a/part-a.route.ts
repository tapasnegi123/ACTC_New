import { Routes } from "@angular/router";
import { AHomeComponent } from "./a-home/a-home.component";
import { A01Component } from "./a01/a01.component";
import { PartAComponent } from "./part-a.component";

export const  partARoutes:Routes = [
    {path:"", component:PartAComponent , children: [
        { path:"", redirectTo:'home', pathMatch:"full" },
        { path:"home", component:AHomeComponent },
        { path:"section-1", component:A01Component },
    ]}
]