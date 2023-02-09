import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-submit_ACTC_for_Do',
  templateUrl: './submit_ACTC_for_Do.component.html',
  styleUrls: ['./submit_ACTC_for_Do.component.scss']
})
export class Submit_ACTC_for_DoComponent implements OnInit {

  DO_formSubmit:any
  constructor(public activeModal: NgbActiveModal, private _fb:FormBuilder
  ){}

  ngOnInit() {
    this.DO_formSubmit = this._fb.group({
      forwardTo:[""],
      commnent:[""]
    })
  }

  submitForm(){
    console.log(this.DO_formSubmit.value)
  }

}
