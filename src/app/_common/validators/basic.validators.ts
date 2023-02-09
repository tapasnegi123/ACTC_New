import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function MobileNumberValidator(){

}

export function AlphanumericValidator(control:AbstractControl):ValidationErrors | null {
    let regEx = /^[A-Za-z0-9]+$/
    let controlValue = control.value

    return (controlValue === null || controlValue === " " || controlValue === "") ? null : CheckForError()
    
    function CheckForError(){
        return (!regEx.test(controlValue))?{ 'invalidAlphaNum' : true } : null
    }

}

export function CustomNumericLengthValidator(control:AbstractControl):ValidationErrors | null{
    console.log(control.value);
    return {"pattern":false}
}

export function NewCustomNumericLengthValidator(formControlName:string,characterStrength:number):ValidatorFn{
    return (control:AbstractControl):ValidationErrors | null => {
        return {"invalidNum":true}
    }

}

export function NumericLengthValidatorUptoTwo(control:AbstractControl):ValidationErrors | null{
    let regEx = /^[0-9]{0,2}$/
    let controlValue = control.value

    return (controlValue === null || controlValue === " " || controlValue === "") ? null : CheckForError()

    function CheckForError(){
        return (!regEx.test(controlValue))?{ 'numExceedsTwo' : true } : null
    }
}

export function GenericNumericLengthValidator(from:number,to:number):ValidatorFn{
    let regEx:RegExp,controlValue
    return (control:AbstractControl):ValidationErrors | null => {
        if(from == 1 && to == 2) regEx = /^(?!(0))[0-9]{1,2}$/
        if(from == 1 && to == 3) regEx = /^(?!(0))[0-9]{1,3}$/
        controlValue = control.value

        if(controlValue == (null||undefined) || controlValue == "" )CheckForError(regEx,controlValue)
        return null
    } 
}


 function CheckForError(regEx:RegExp,controlValue:any){
    return (!regEx.test(controlValue))?{ 'invalid' : true } : null
}