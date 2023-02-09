import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/_common/shared.module";
import { PartCComponent } from "./part-c.component";
import { PartCSummaryComponent } from './part-c-summary/part-c-summary.component';

@NgModule({
    imports:[
        SharedModule
    ],
    declarations:[
        PartCComponent,
        PartCSummaryComponent
    ],
    exports:[
        PartCComponent
    ],
    

})
export class PartCModule{

}