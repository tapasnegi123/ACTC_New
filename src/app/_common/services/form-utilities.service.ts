import { Injectable } from "@angular/core";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";


@Injectable({
    providedIn: 'any'
})

export class FormUtilities{

    constructor(private fg:FormGroup){
    }

    private get formControls(){
        return this.fg.controls
    }

    MarkAllAsTouched(formControlName:string,control:AbstractControl){
        this.formControls[formControlName].setValue(null)
    }

    SetvalueNullAndMarkAsTouched(controlName:string){
        this.formControls[controlName].setValue(null)
        this.formControls[controlName].markAsUntouched()
    }

}