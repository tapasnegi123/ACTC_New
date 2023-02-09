import { NgModule } from '@angular/core';
import { SharedModule } from '../_common/shared.module';
import { OuterPagesRoutingModule } from './outer-pages.routing.module';
import { ContactUsComponent,LoginComponent,
  ApprovedActcComponent,LoginWithOtpComponent,ResetPasswordComponent,
  ForgotPasswordComponent,OuterPagesComponent
} from './outer-pages.barrel';
import { OuterLayoutFooterComponent, OuterLayoutHeaderComponent } from '../_common/components/layout/outer-layout/outer-layout.barrel';
import { CaptchaComponent, TimerComponent, TypeaheadComponent } from '../_common/shared.barrel';
import { HomeModule } from './home/home.module';

@NgModule({
  declarations: [
    OuterPagesComponent,
    LoginComponent,
    ContactUsComponent,
    ApprovedActcComponent,
    LoginWithOtpComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    OuterLayoutFooterComponent,
    OuterLayoutHeaderComponent,
    CaptchaComponent,
    TypeaheadComponent,
    TimerComponent,
  ],

  exports: [],

  imports: [SharedModule, OuterPagesRoutingModule,HomeModule],
})
export class OutterPagesModule {}
