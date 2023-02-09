import { DatePipe } from '@angular/common';
import { NgModule } from "@angular/core";
import { DateDifferencePipe } from "src/app/_common/pipes/date-difference.pipe";
import { SharedModule } from "src/app/_common/shared.module";
import { ActcFormsPartBSectionFourComponent } from "./actc-forms-part-b-section-four/actc-forms-part-b-section-four.component";
import { ActcFormsPartBSectionOneComponent } from "./actc-forms-part-B-section-one/actc-forms-part-B-section-one.component";
import { ActcFormsPartBSectionThreeComponent } from "./actc-forms-part-B-section-three/actc-forms-part-B-section-three.component";
import { ActcFormsPartBSectionTwoComponent } from "./actc-forms-part-B-section-two/actc-forms-part-B-section-two.component";
import { ActcFormsPartBSummaryComponent } from "./actc-forms-part-b-summary/actc-forms-part-b-summary.component";
import { ActcFormsPartBComponent } from "./actc-forms-part-B.component";
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
    imports:[
        SharedModule,
        NgSelectModule
    ],
    declarations:[
        ActcFormsPartBComponent,
        ActcFormsPartBSectionOneComponent,
        ActcFormsPartBSectionTwoComponent,
        ActcFormsPartBSectionThreeComponent,
        ActcFormsPartBSectionFourComponent,
        ActcFormsPartBSummaryComponent,
        // DateDifferencePipe
    ],
    exports:[
        ActcFormsPartBComponent,
        ActcFormsPartBSectionOneComponent,
        ActcFormsPartBSectionTwoComponent,
        ActcFormsPartBSectionThreeComponent,
        ActcFormsPartBSectionFourComponent,
        ActcFormsPartBSummaryComponent
    ],
    // providers:[DatePipe]

})

export class ActcFormsPartBModule{

}