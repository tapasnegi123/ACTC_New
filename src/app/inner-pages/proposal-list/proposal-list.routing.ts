import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProposalListComponent } from './proposal-list.component';
import { ProposalsComponent } from './proposals/proposals.component';

const proposalListRoutes: Routes = [
  {
    path: '',
    component: ProposalListComponent,
    children: [
      { path: '', redirectTo: 'proposals', pathMatch: 'full' },
      { path: 'proposals', component: ProposalsComponent },
      {
        path: 'ncc',
        loadChildren: () =>
          import('./national-coaching-camps/national-coaching-camps.module').then((x) => x.NationalCoachingCampsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(proposalListRoutes)],
  exports: [RouterModule],
})
export class ProposalListRoutingModule {}
