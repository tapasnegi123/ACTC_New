import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'any'
})
export class AlertService {

constructor() { }

ShowWarning(title:string,timer?:number,body?:string,showConfirmButton?:boolean,confirmBtnText?:string){
  Swal.fire({
    html:"<b>" + body + "</b>",
    position: 'center',
    title: title + '!',
    showConfirmButton: showConfirmButton?showConfirmButton:false,
    confirmButtonColor: "#1f91c0",
    confirmButtonText: confirmBtnText?confirmBtnText:'Ok',
    timer: timer,
    width:600,
    heightAuto:false
  });
}

ShowSuccess(message:string){
  Swal.fire({
    position: 'center',
    icon: 'success',
    text: message,
    showConfirmButton: false,
    timer: 2000,
    width:600,
  });
}

swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',

  },
  buttonsStyling: false
})

ShowConfirmation(title:string,message:string,confirmBtnText:string,cancelBtnText:string,successTitle:string,successMessage:string){
  this.swalWithBootstrapButtons.fire({
    title: title,
    text: message,
    showCancelButton: true,
    showConfirmButton:true,
    confirmButtonText: confirmBtnText,
    cancelButtonText: cancelBtnText,
  }).then((result) => {
    if (result.isConfirmed) {
      this.swalWithBootstrapButtons.fire(
        successTitle,
        successMessage,
        'success'
      )
    }
  })
}



}
