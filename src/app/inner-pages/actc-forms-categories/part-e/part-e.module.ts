import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/_common/shared.module';
import { PartESectionOneComponent } from './part-e-section-one/part-e-section-one.component';
import { PartEComponent } from './part-e.component';
import { PartESectionTwoComponent } from './part-e-section-two/part-e-section-two.component';

@NgModule({
  declarations: [
    PartEComponent,
    PartESectionOneComponent,
    PartESectionTwoComponent
  ],
  imports: [SharedModule],
  exports: [PartEComponent],
})
export class PartEModule {}
