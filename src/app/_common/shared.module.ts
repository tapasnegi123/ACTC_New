import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from './components/loader/loader.component';
import { AdditionPipe } from './pipes/addition.pipe';
import { DateDifferencePipe } from './pipes/date-difference.pipe';
import { EstimateExpenditurePipe } from './pipes/estimated-expenditure.pipe';
import { MultiplicationPipe } from './pipes/multiplication.pipe';
import { AddModalWindowComponent } from './modal-windows/add-modal-window/add-modal-window.component';
import { Submit_ACTC_for_DoComponent } from './modal-windows/submit_ACTC_for_Do/submit_ACTC_for_Do.component';
import { Submit_ACTC_for_SDOComponent } from './modal-windows/submit_ACTC_for_SDO/submit_ACTC_for_SDO.component';
import { AddTournamentComponent } from './modal-windows/add-tournament/add-tournament.component';
import { AddEventComponent } from './modal-windows/add-event/add-event.component';
import { MapEventTournamnetComponent } from './modal-windows/map-event-tournamnet/map-event-tournamnet.component';
import { AddEquipmentComponent } from './modal-windows/add-equipment/add-equipment.component';
import { AddAgeCategoryComponent } from './modal-windows/add-age-category/add-age-category.component';

@NgModule({
  declarations: [
    DateDifferencePipe,
    EstimateExpenditurePipe,
    LoaderComponent,
    AdditionPipe,
    MultiplicationPipe,
    AddModalWindowComponent,
    Submit_ACTC_for_DoComponent,
    Submit_ACTC_for_SDOComponent,
    AddTournamentComponent,
    AddEventComponent,
    MapEventTournamnetComponent,
    AddEquipmentComponent,
    AddAgeCategoryComponent
  ],
  imports: [CommonModule, 
    ReactiveFormsModule, 
    FormsModule,
    NgbModule
  ],

  exports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgbModule,
    DateDifferencePipe,
    EstimateExpenditurePipe,
    AdditionPipe,
    LoaderComponent,
    MultiplicationPipe
  ],

  providers: [
    EstimateExpenditurePipe
  ]
})
export class SharedModule {}
