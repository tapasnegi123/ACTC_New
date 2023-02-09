import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function CaptchValidator(inputCode:string, captchaCode: string):ValidatorFn{

    return (control:AbstractControl):ValidationErrors | null => {
        const enteredCode = control.get(inputCode)?.value
        
        // const confirmPass = control.get(captchaCode)?.value
        const correctCode = captchaCode

        debugger
        if(enteredCode != correctCode && correctCode != enteredCode){
            return { "captchaNotMatched" : true}
        }
        return null
    }

}
