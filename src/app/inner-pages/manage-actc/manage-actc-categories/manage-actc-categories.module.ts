import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BudgetSynopsisComponent } from "./budget-synopsis/budget-synopsis.component";
import { FundingPatternComponent } from "./funding-pattern/funding-pattern.component";
import { KraMilestonesComponent } from "./kra-milestones/kra-milestones.component";
import { ManageActcCategoriesComponent } from "./manage-actc-categories.component";
import { PresentPerformanceComponent } from "./present-performance/present-performance.component";
import { ProposedActcComponent } from "./proposed-actc/proposed-actc.component";

const manageActcRoutes:Routes = [

    { path:'',component:ManageActcCategoriesComponent,children:[
        { path:'', redirectTo:'present-performance', pathMatch:"full"},
        { path:'present-performance',component:PresentPerformanceComponent,title:"ACTC - present performance"},
        { path:'funding-pattern',component:FundingPatternComponent,title:"ACTC - funding patern"},
        { path:'kra-milestones',component:KraMilestonesComponent,title:"ACTC - kra milestones"},
        { path:'budget-synopsis',component:BudgetSynopsisComponent,title:"ACTC - budget synopsis"},
        { path:'proposed-actc',component:ProposedActcComponent,title:"ACTC - proposed actc"},
    ]},
]

@NgModule({
    imports:[RouterModule.forChild(manageActcRoutes)],
    exports: [RouterModule]
})

export class ManageActcCategoriesModule{

}