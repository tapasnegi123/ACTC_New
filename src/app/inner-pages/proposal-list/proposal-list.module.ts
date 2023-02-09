import { NgModule } from '@angular/core';
import { NationalCoachingCampsComponent } from './national-coaching-camps/national-coaching-camps.component';
import { ProposalListComponent } from './proposal-list.component';
import { ProposalListRoutingModule } from './proposal-list.routing';
import { ProposalsComponent } from './proposals/proposals.component';

@NgModule({
  imports: [ProposalListRoutingModule],
  declarations: [NationalCoachingCampsComponent, ProposalsComponent,ProposalListComponent],
})
export class ProposlListModule {}
