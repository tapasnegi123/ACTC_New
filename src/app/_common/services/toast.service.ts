import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts: any[] = [];
  
  constructor() { }

private show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    // debugger
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast:any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  ShowSuccess(message:string){
    this.show(message, { classname: 'bg-success text-light', delay: 3500 });
  }

  ShowWarning(message:string){
    this.show(message, { classname: 'bg-danger text-light', delay: 3500 });
  }

  
}
