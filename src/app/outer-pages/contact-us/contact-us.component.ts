import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup, Validators} from '@angular/forms';
import { Observer, Subject, take, takeUntil } from 'rxjs';
import { AlertService } from 'src/app/_common/services/alert.service';
import { AuthenticationService } from 'src/app/_common/services/authentication.service';
import { ToastService } from 'src/app/_common/services/toast.service';
import { EmailValidator } from 'src/app/_common/validators/email.validator';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

 
  constructor(private _toast:ToastService, private _auth:AuthenticationService, private _alert:AlertService) {}
  ngOnInit(){
  }
  title:any="CONTACT US"
  
  contactForm:any= new FormGroup({
    fullName : new FormControl('',[Validators.required, Validators.pattern("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")]),
    emailAddress: new FormControl('', [Validators.required,EmailValidator] ),
    phoneNo : new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    message : new FormControl('',[Validators.required]),
    isACTC: new FormControl(true)
  })

  get contactUsControl(){
    return this.contactForm.controls
  }

  showMsg: boolean = false;

  getData(){
    console.log("this.contactForm.value")
    this.showMsg= true;
  }

  unsubscribe:Subject<any> = new Subject()

  ContactUs(formData:any){
    console.log("contact us button is called")
    this._auth.ContactUs(formData).pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (result:any) => {
        if(result > 0){
        this.contactForm.reset();
        // this._toast.ShowSuccess("Form has been submitted. We will contact you shortly")
        this._alert.ShowSuccess("Form has been submitted. We will contact you shortly")
      }else{
        // this._toast.ShowWarning("Something went wrong.Please contact the admin")
        this._alert.ShowWarning("Something went wrong.",0,'Please contact the admin.',true)
      }
      },
      error: (error) => {
        // this._toast.ShowWarning("Something went wrong.Please contact the admin")
        this._alert.ShowWarning("Something went wrong.Please contact the admin",0,error,true)
      }
    })
  }

  ngDestroy(){
    this.unsubscribe.unsubscribe()
  }

}
