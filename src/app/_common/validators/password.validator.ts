import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ConfirmedValidator(newPassword:string, confirmPassword: string):ValidatorFn{

    return (control:AbstractControl):ValidationErrors | null => {
        const newPass = control.get(newPassword)?.value
        const confirmPass = control.get(confirmPassword)?.value
        
        // debugger
        if(newPass != confirmPass && confirmPass != newPass){
            return { "notMatched" : true}
        }
        return null
    }

}
