import { Pipe, PipeTransform, ɵɵsetComponentScope } from '@angular/core';

@Pipe({
    name:'multiplication'
})

export class MultiplicationPipe implements PipeTransform {

    transform(...arrayOfNumbers:Array<any>) {
        let result, newArray, valueType
        newArray = arrayOfNumbers.flat()
        
        valueType = newArray.map( element => parseInt(element)).every(element => typeof element == "number")
        if(valueType) result = Math.floor(newArray.reduce( (accumulatedValue,currentValue) => accumulatedValue * currentValue)).toFixed(2)
        else result = ''
        return result
    }
} 