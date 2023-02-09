import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name:'addition',
    standalone:false
})

export class AdditionPipe implements PipeTransform{
    transform(firstNumber:any, secondNumber:any) {
        let firstVal,secondVal
        firstVal = Number.parseFloat(firstNumber)
        secondVal = Number.parseFloat(secondNumber)
        return (firstVal + secondVal).toFixed(2)
    }
}