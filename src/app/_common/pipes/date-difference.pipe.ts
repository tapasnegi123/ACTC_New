import { Pipe, PipeTransform } from "@angular/core";
import { differenceInHours } from "date-fns";

@Pipe({
    name:'dateDifference',
    standalone:false
})

export class DateDifferencePipe implements PipeTransform{

    transform(fromDate:any, toDate:any) {

        if(fromDate == "" || toDate == ""){
            return ""
        }else{
            return Math.floor(differenceInHours(new Date(toDate), new Date(fromDate))/24)|0 
        }

    }
}