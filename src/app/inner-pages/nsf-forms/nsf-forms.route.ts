import { inject } from "@angular/core";
import { Routes } from "@angular/router";
import { RouteDateService } from "src/app/_common/services/route-date.service";
import { NsfFormsComponent } from "./nsf-forms.component";

// const _routeDate = inject(l
export var nsfRoute:Routes = [
    { path:"", component: NsfFormsComponent,children: [
        {path:"",redirectTo:'part-a',pathMatch:"full"},
        { path:'part-a',loadChildren: () => import("./part-a/part-a.module").then(x => x.PartAModule)},
        { path:'part-b',loadChildren: () => import("./part-b/part-b.module").then(x => x.PartBModule)},
        { path:'part-c',loadChildren: () => import("./part-c/part-c.module").then(x => x.PartCModule)},
        { path:'part-d',loadChildren: () => import("./part-d/part-d.module").then(x => x.PartDModule)},
        { path:'part-e',loadChildren: () => import("./part-e/part-e.module").then(x => x.PartEModule)},
        { path:'part-f',loadChildren: () => import("./part-f/part-f.module").then(x => x.PartFModule)},
    ]},
]