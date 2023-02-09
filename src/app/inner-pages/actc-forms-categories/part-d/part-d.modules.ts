import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/_common/shared.module';
import { PartDSectionOneComponent } from './part-d-section-one/part-d-section-one.component';
import { PartDSectionThreeComponent } from './part-d-section-three/part-d-section-three.component';
import { PartDSectionTwoComponent } from './part-d-section-two/part-d-section-two.component';
import { PartDComponent } from './part-d.component';

@NgModule({
  declarations: [
    PartDComponent,
    PartDSectionOneComponent,
    PartDSectionTwoComponent,
    PartDSectionThreeComponent,
  ],
  imports: [SharedModule],
  exports: [PartDComponent],
})
export class PartDModule {}
