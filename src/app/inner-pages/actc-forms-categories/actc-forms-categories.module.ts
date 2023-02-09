import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/_common/shared.module";
import { ActcFormCategoriesComponent } from "./actc-form-categories.component";
import { ActcFormsPartAModule } from "./actc-forms-part-A/actc-forms-part-A.module";
import { ActcFormsPartBModule } from "./actc-forms-part-B/actc-forms-part-B.module";
import { PartCModule } from "./part-c/part-c.module";
import { PartDModule } from "./part-d/part-d.modules";
import { PartEModule } from "./part-e/part-e.module";

@NgModule({
    declarations:[
        ActcFormCategoriesComponent,
    ],
    imports:[
        SharedModule,
        ActcFormsPartAModule,
        ActcFormsPartBModule,
        PartCModule,
        PartDModule,
        PartEModule,
    ],
    exports:[
        ActcFormsPartAModule,
        ActcFormsPartBModule,
        ActcFormCategoriesComponent
    ],
    providers:[
    ]

})


export class ActcFormCategoriesModule {

}