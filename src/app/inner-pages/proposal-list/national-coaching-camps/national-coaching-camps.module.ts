import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NationalCoachingCampsComponent } from './national-coaching-camps.component';
import { Ncc01Component } from './ncc01/ncc01.component';
import { Ncc02Component } from './ncc02/ncc02.component';
import { Ncc03Component } from './ncc03/ncc03.component';

const nccRoutes:Routes = [
  { path:'' , component:NationalCoachingCampsComponent , children: [
    { path:'section-1', component: Ncc01Component}
  ]}
]

@NgModule({
  declarations: [
    Ncc01Component,
    Ncc02Component,
    Ncc03Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(nccRoutes)
  ]
})
export class NationalCoachingCampsModule { }
