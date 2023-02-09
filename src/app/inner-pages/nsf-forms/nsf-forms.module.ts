import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { nsfRoute } from "./nsf-forms.route";
@NgModule({
      declarations:[
        
      ],
      imports:[
        RouterModule.forChild(nsfRoute),
      ],
})

export class NSFModule{

}