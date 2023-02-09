import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ActcFormCategoriesComponent } from "./actc-forms-categories/actc-form-categories.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { InnerPagesContactUsComponent } from "./inner-pages-contact-us/inner-pages-contact-us.component";
import { InnerPagesComponent } from "./inner-pages.component";
import { ManageActcComponent } from "./manage-actc/manage-actc.component";
import { ProposalListComponent } from "./proposal-list/proposal-list.component";
import { TournamentsComponent } from "./tournaments/tournaments.component";
import { EquipmentsComponent } from "./equipments/equipments.component";
import { AgeCategoryComponent } from "./age-category/age-catergory.component";
import { TournamentEventComponent } from "./tournaments/tournament-event/tournament-event.component";
import { NsfFormsComponent } from "./nsf-forms/nsf-forms.component";


const outerRoutes: Routes = [
    {
        path: '', component: InnerPagesComponent,
        children: [
            { path:'' , redirectTo:'dashboard',pathMatch:'full'},
            { path:'dashboard' , component: DashboardComponent,title:'ACTC - dashboard' },
            // { path:'manage-actc', title:'ACTC - manage actc' , component: ManageActcComponent },
            { path:'manage-actc', title:'ACTC - manage actc', loadChildren: () => import("./manage-actc/manage-actc.module").then(x => x.ManageActcModule) },
            // { path:'proposal-list' , component: ProposalListComponent },
            { path:'proposal-list' , loadChildren: () => import("./proposal-list/proposal-list.module").then(x => x.ProposlListModule) },
            // { path:'actc-forms/:year', title:'ACTC - actc forms' , component: ActcFormCategoriesComponent },
            { path:'nsf-forms/:year', title:'ACTC - actc forms' , loadChildren: () => import("./nsf-forms/nsf-forms.module").then( x => x.NSFModule) },
            { path:'contact' , component: InnerPagesContactUsComponent },
            { path:'tournaments' , component: TournamentsComponent,title:'ACTC - tournaments' },
            { path:'equipments' , component: EquipmentsComponent,title:'ACTC - equipents' },
            { path:'age-category' , component: AgeCategoryComponent,title:'ACTC - Age-Category' },
            { path:'tournaments/eventmaster' , component: TournamentEventComponent,title:'tournament-event' },

        ]
    }

]

@NgModule({
    declarations: [],
    exports: [RouterModule],
    imports: [RouterModule.forChild(outerRoutes)]
})

export class InnerPagesRoutingModule {

}
