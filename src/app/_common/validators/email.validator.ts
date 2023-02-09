import { AbstractControl, ValidationErrors } from "@angular/forms";

export function EmailValidator(control:AbstractControl):ValidationErrors | null{
    // console.log(control);
    
    let regEx:RegExp,controlValue:string

    regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    controlValue = control.value

    return (controlValue === null || controlValue === " " || controlValue === "") ? null : CheckForError()
    
    function CheckForError(){
        return (!regEx.test(controlValue))?{ 'invalidEmail' : true } : null
    }

}