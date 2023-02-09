import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/_common/shared.module";
import { ActcFormsPartASectionFiveComponent } from "./actc-forms-part-A-section-five/actc-forms-part-A-section-five.component";
import { ActcFormsPartASectionFourComponent } from "./actc-forms-part-A-section-four/actc-forms-part-A-section-four.component";
import { ActcFormsPartASectionOneComponent } from "./actc-forms-part-A-section-one/actc-forms-part-A-section-one.component";
import { ActcFormsPartASectionSevenComponent } from "./actc-forms-part-A-section-seven/actc-forms-part-A-section-seven.component";
import { ActcFormsPartASectionSixComponent } from "./actc-forms-part-A-section-six/actc-forms-part-A-section-six.component";
import { ActcFormsPartASectionThreeComponent } from "./actc-forms-part-A-section-three/actc-forms-part-A-section-three.component";
import { ActcFormsPartASectionTwoComponent } from "./actc-forms-part-A-section-two/actc-forms-part-A-section-two.component";
import { ActcFormsPartASummaryComponent } from "./actc-forms-part-A-summary/actc-forms-part-A-summary.component";
import { ActcFormsPartAComponent } from "./actc-forms-part-A.component";
import { ActcFormsPartASectionEightComponent } from './actc-forms-part-a-section-eight/actc-forms-part-a-section-eight.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    imports:[
        SharedModule,
        NgSelectModule
    ],
    declarations:[
        ActcFormsPartAComponent,
        ActcFormsPartASectionOneComponent,
        ActcFormsPartASectionTwoComponent,
        ActcFormsPartASectionThreeComponent,
        ActcFormsPartASectionFourComponent,
        ActcFormsPartASectionFiveComponent,
        ActcFormsPartASectionSixComponent,
        ActcFormsPartASectionSevenComponent,
        ActcFormsPartASummaryComponent,
        ActcFormsPartASectionEightComponent,
    ],
    exports:[
        ActcFormsPartAComponent,
        ActcFormsPartASectionOneComponent,
        ActcFormsPartASectionTwoComponent,
        ActcFormsPartASectionThreeComponent,
        ActcFormsPartASectionFourComponent,
        ActcFormsPartASectionFiveComponent,
        ActcFormsPartASectionSixComponent,
        ActcFormsPartASectionSevenComponent,
        ActcFormsPartASummaryComponent
    ],
    

})
export class ActcFormsPartAModule{

}