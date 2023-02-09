import { NgModule } from '@angular/core';
import { ManageActcCategoriesComponent } from './manage-actc-categories/manage-actc-categories.component';
import { ActcListComponent } from './manage-actc-list/manage-actc-list.component';
import { ManageActcComponent } from './manage-actc.component';
import { PresentPerformanceComponent } from './manage-actc-categories/present-performance/present-performance.component';
import { FundingPatternComponent } from './manage-actc-categories/funding-pattern/funding-pattern.component';
import { BudgetSynopsisComponent } from './manage-actc-categories/budget-synopsis/budget-synopsis.component';
import { ProposedActcComponent } from './manage-actc-categories/proposed-actc/proposed-actc.component';
import { SharedModule } from 'src/app/_common/shared.module';
import { KraMilestonesComponent } from './manage-actc-categories/kra-milestones/kra-milestones.component';
import { SeniorComponent } from './manage-actc-categories/proposed-actc/senior/senior.component';
import { JuniorComponent } from './manage-actc-categories/proposed-actc/junior/junior.component';
import { JuniorDevelopmentProgramComponent } from './manage-actc-categories/proposed-actc/junior-development-program/junior-development-program.component';
import { CoachesDevelopmentProgramComponent } from './manage-actc-categories/proposed-actc/coaches-development-program/coaches-development-program.component';
import { ReleaseMomComponent } from './release-mom/release-mom.component';
import { ManageActcRoutingModule } from './manage-actc.routing';

@NgModule({
  declarations: [
    ManageActcComponent,
    ManageActcCategoriesComponent,
    ActcListComponent,
    PresentPerformanceComponent,
    FundingPatternComponent,
    KraMilestonesComponent,
    BudgetSynopsisComponent,
    ProposedActcComponent,
    SeniorComponent,
    JuniorComponent,
    JuniorDevelopmentProgramComponent,
    CoachesDevelopmentProgramComponent,
    ReleaseMomComponent
  ],
  imports: [
    SharedModule,
    ManageActcRoutingModule
  ],
  exports: [],
})
export class ManageActcModule {}
