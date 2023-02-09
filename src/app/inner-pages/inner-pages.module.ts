import { NgbActiveModal,NgbModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { TournamentEventComponent } from './tournaments/tournament-event/tournament-event.component';
import { EquipmentsComponent } from './equipments/equipments.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from "@angular/core";
import { InnerLayoutFooterComponent, InnerLayoutHeaderComponent } from "../_common/components/layout/inner-layout/inner-layout.barrel";
import { SharedModule } from "../_common/shared.module";
import { ActcFormCategoriesModule } from "./actc-forms-categories/actc-forms-categories.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { NsfDashboardComponent } from "./dashboard/nsf-dashboard/nsf-dashboard.component";
import { InnerPagesComponent } from "./inner-pages.component";
import { InnerPagesRoutingModule } from "./inner-pages.routing.module";
import { ManageActcModule } from "./manage-actc/manage-actc.module";
import { InnerPagesContactUsComponent } from "./inner-pages-contact-us/inner-pages-contact-us.component";
import { TournamentsComponent } from "./tournaments/tournaments.component";
import { FormsModule } from "@angular/forms";
import { AgeCategoryComponent } from './age-category/age-catergory.component';
import { NsfFormsComponent } from './nsf-forms/nsf-forms.component';

@NgModule({
    imports: [
        InnerPagesRoutingModule,
        SharedModule,
        ActcFormCategoriesModule,
        ManageActcModule,
        NgSelectModule,
        NgbModule

    ],
    providers:[
      NgbActiveModal
    ],
    declarations: [
        NsfFormsComponent,
        InnerPagesComponent,
        DashboardComponent,
        NsfDashboardComponent,
        InnerLayoutFooterComponent,
        InnerLayoutHeaderComponent,
        InnerPagesContactUsComponent,
        TournamentsComponent,
        EquipmentsComponent,
        TournamentEventComponent,
        AgeCategoryComponent
    ],
    exports: [],
})

export class InnerPagesModule {

}
