import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss']
})
export class PasswordInputComponent implements OnInit {

  @Input() options:IPasswordEyeOptions = {
    formControlName: '',
    placeholder: ''
  }

  // @Input() formControlName:any

  constructor() { }

  ngOnInit() {
  }

}

export interface IPasswordEyeOptions{
  formControlName:string,
  placeholder:string,

}
