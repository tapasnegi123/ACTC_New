import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/_common/shared.module";
import { PartAComponent } from "./part-a.component";
import { partARoutes } from "./part-a.route";


@NgModule({
    declarations:[
        PartAComponent,
    ],
    imports:[
        SharedModule,
        RouterModule.forChild(partARoutes)
    ]
})

export class PartAModule{

}