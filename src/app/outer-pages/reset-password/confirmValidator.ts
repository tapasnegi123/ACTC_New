import { FormGroup } from "@angular/forms";

export function confirmValidator(controlName: string , matchingControlName: string){
    return (FormGroup: FormGroup) => {
        const control = FormGroup.controls[controlName];
        const matchingControl = FormGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors['ConfirmedValidators']){
            return;
        }
        if(control.value !== matchingControl.value){
            matchingControl.setErrors({confirmValidator : true});
        }
        else {
            matchingControl.setErrors(null);
        }
    }
}